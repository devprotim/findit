import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from '../../services/application.service';
import { Job } from '../../models/job.model';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss']
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  applying = false;
  userApplication: Application | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadJob();
  }

  loadJob(): void {
    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (!jobId) {
      this.router.navigate(['/jobs']);
      return;
    }

    this.loading = true;
    this.jobService.getJobById(jobId).subscribe({
      next: (response) => {
        this.job = response.data.job;
        this.loading = false;

        // If user is authenticated and is a job seeker, check if they've already applied
        if (this.isAuthenticated() && this.isJobSeeker()) {
          this.checkApplicationStatus(jobId);
        }
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error loading job details', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
        this.router.navigate(['/jobs']);
      }
    });
  }

  checkApplicationStatus(jobId: number): void {
    this.applicationService.getUserApplications().subscribe({
      next: (response) => {
        const applications = response.data.applications;
        this.userApplication = applications.find(app => app.jobId === jobId) || null;
      },
      error: (error) => {
        console.error('Error checking application status:', error);
      }
    });
  }

  applyForJob(): void {
    if (!this.job || !this.job.id) return;

    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/jobs/${this.job.id}` }
      });
      return;
    }

    if (!this.isJobSeeker()) {
      this.snackBar.open('Only job seekers can apply for jobs', 'Close', {
        duration: 5000
      });
      return;
    }

    // Open application dialog
    // For simplicity, we'll just apply directly here
    // In a real app, you might want to open a dialog to collect cover letter
    this.applying = true;

    const applicationRequest = {
      jobId: this.job.id,
      coverLetter: 'I am interested in this position and would like to apply.'
    };

    this.applicationService.applyForJob(applicationRequest).subscribe({
      next: (response) => {
        this.snackBar.open('Application submitted successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.userApplication = response.data.application;
        this.applying = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error submitting application', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.applying = false;
      }
    });
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

  isJobOwner(): boolean {
    if (!this.job || !this.isAuthenticated()) return false;

    // Use currentUserValue instead of getCurrentUser()
    const currentUser = this.authService.currentUserValue;
    return currentUser?.id === this.job.employerId;
  }

  getApplicationStatusClass(status: string): string {
    switch (status) {
      case 'applied': return 'status-applied';
      case 'reviewed': return 'status-reviewed';
      case 'interviewed': return 'status-interviewed';
      case 'rejected': return 'status-rejected';
      case 'hired': return 'status-hired';
      default: return '';
    }
  }

  editJob(): void {
    if (!this.job || !this.job.id) return;
    this.router.navigate(['/create-job'], { queryParams: { id: this.job.id } });
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}
