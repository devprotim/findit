import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Job, JobRequest } from '../../models/job.model';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.scss']
})
export class JobCreateComponent implements OnInit {
  loading = false;
  jobId!: number;
  job: Job | null = null;


  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.jobId = +id;
      this.loadJobData();
    }
    // Check if user is authenticated and is an employer
    if (!this.authService.checkAuth() || !this.authService.isEmployer()) {
      this.snackBar.open('Only employers can create jobs', 'Close', {
        duration: 5000
      });
      this.router.navigate(['/jobs']);
    }
  }

  loadJobData() {
    this.loading = true;
    this.jobService.getJobById(this.jobId).subscribe({
      next: (response) => {
        this.job = response.data.job;
        this.loading = false;
        console.log('Job loaded:', this.job);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error loading job details', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
        this.router.navigate(['/jobs']);
      }
    })
  }

  onSubmit(jobRequest: JobRequest): void {
    this.loading = true;

    // Determine if we're creating a new job or updating an existing one
    if (this.jobId) {
      // Update existing job
      this.jobService.updateJob(this.jobId, jobRequest).subscribe({
        next: (response) => {
          this.snackBar.open('Job updated successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.loading = false;

          // Navigate to the updated job
          if (response.data.job.id) {
            this.router.navigate(['/jobs', response.data.job.id]);
          } else {
            this.router.navigate(['/my-jobs']);
          }
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Error updating job', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
    } else {
      // Create new job
      this.jobService.createJob(jobRequest).subscribe({
        next: (response) => {
          this.snackBar.open('Job created successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.loading = false;

          // Navigate to the newly created job
          if (response.data.job.id) {
            this.router.navigate(['/jobs', response.data.job.id]);
          } else {
            this.router.navigate(['/my-jobs']);
          }
        },
        error: (error) => {
          this.snackBar.open(error.error?.message || 'Error creating job', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/my-jobs']);
  }
}
