import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { Application, ApplicationStatusRequest } from '../../models/application.model';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  applications: Application[] = [];
  dataSource = new MatTableDataSource<Application>([]);
  loading = false;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  jobId?: number;

  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Check if we're viewing applications for a specific job
    this.route.paramMap.subscribe(params => {
      const jobIdParam = params.get('jobId');
      if (jobIdParam) {
        this.jobId = +jobIdParam;
      }
    });

    // Set displayed columns based on user role
    this.setDisplayedColumns();

    // Load applications
    this.loadApplications();
  }

  setDisplayedColumns(): void {
    if (this.isEmployer()) {
      this.displayedColumns = ['applicantName', 'jobTitle', 'appliedDate', 'status', 'actions'];
    } else {
      this.displayedColumns = ['jobTitle', 'companyName', 'appliedDate', 'status', 'actions'];
    }
  }

  loadApplications(): void {
    this.loading = true;

    const params = {
      page: this.currentPage + 1, // API uses 1-based indexing
      limit: this.pageSize
    };

    // Determine which service method to call based on user role and context
    let applicationsObservable;

    if (this.isEmployer() && this.jobId) {
      // Employer viewing applications for a specific job
      applicationsObservable = this.applicationService.getJobApplications(this.jobId, params);
    } else if (this.isJobSeeker()) {
      // Job seeker viewing their own applications
      applicationsObservable = this.applicationService.getUserApplications(params);
    } else {
      // Unauthorized access
      this.snackBar.open('Unauthorized access', 'Close', { duration: 5000 });
      this.router.navigate(['/jobs']);
      return;
    }

    applicationsObservable.subscribe({
      next: (response) => {
        this.applications = response.data.applications;
        this.dataSource = new MatTableDataSource(this.applications);
        this.totalItems = response.data.pagination.totalItems;
        this.loading = false;

        // Set up sorting and pagination after data is loaded
        setTimeout(() => {
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        });
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error loading applications', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadApplications();
  }

  updateStatus(application: Application, newStatus: string): void {
    if (!application.id) return;

    const statusRequest: ApplicationStatusRequest = {
      status: newStatus as any
    };

    this.applicationService.updateApplicationStatus(application.id, statusRequest).subscribe({
      next: (response) => {
        this.snackBar.open('Application status updated successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });

        // Update the application in the list
        const index = this.applications.findIndex(app => app.id === application.id);
        if (index !== -1) {
          this.applications[index] = response.data.application;
          this.dataSource.data = [...this.applications];
        }
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error updating application status', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/jobs', jobId]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'applied': return 'status-applied';
      case 'reviewed': return 'status-reviewed';
      case 'interviewed': return 'status-interviewed';
      case 'rejected': return 'status-rejected';
      case 'hired': return 'status-hired';
      default: return '';
    }
  }

  isEmployer(): boolean {
    return this.authService.isEmployer();
  }

  isJobSeeker(): boolean {
    return this.authService.isJobSeeker();
  }
}
