import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Job } from '../../models/job.model';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = false;
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  filterForm!: FormGroup;
  isEmployerView = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ];

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Check if we're in employer mode (my-jobs)
    this.route.data.subscribe(data => {
      this.isEmployerView = data['employerJobs'] === true;
    });

    // Initialize filter form
    this.filterForm = this.formBuilder.group({
      search: [''],
      location: [''],
      jobType: ['']
    });

    // Subscribe to form changes with debounce
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadJobs();
      });

    // Initial load
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;

    const params = {
      page: this.currentPage + 1, // API uses 1-based indexing
      limit: this.pageSize,
      search: this.filterForm.get('search')?.value || '',
      location: this.filterForm.get('location')?.value || '',
      jobType: this.filterForm.get('jobType')?.value || ''
    };

    // Determine which service method to call based on view
    const jobsObservable = this.isEmployerView
      ? this.jobService.getEmployerJobs(params)
      : this.jobService.getJobs(params);

    jobsObservable.subscribe({
      next: (response) => {
        this.jobs = response.data.jobs;
        this.totalItems = response.data.pagination.totalItems;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error loading jobs', 'Close', {
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
    this.loadJobs();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadJobs();
  }

  viewJobDetails(jobId: number): void {
    this.router.navigate(['/jobs', jobId]);
  }

  isAuthenticated(): boolean {
    return this.authService.checkAuth();
  }

  isEmployer(): boolean {
    return this.authService.isEmployer();
  }

  isJobSeeker(): boolean {
    return this.authService.isJobSeeker();
  }
}
