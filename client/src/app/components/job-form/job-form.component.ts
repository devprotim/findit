import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Job, JobRequest } from '../../models/job.model';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit, OnChanges {
  @Input() job: Job | null = null;
  @Input() loading = false;
  @Output() formSubmit = new EventEmitter<JobRequest>();
  @Output() formCancel = new EventEmitter<void>();

  jobForm!: FormGroup;

  jobTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    console.log('ngOnInit job:', this.job);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the job input changes and the form is already initialized
    if (changes['job'] && this.jobForm) {
      console.log('ngOnChanges job:', this.job);
      // Only update if the job is not null and has changed
      if (this.job && (!changes['job'].firstChange || changes['job'].currentValue !== changes['job'].previousValue)) {
        this.updateForm();
      }
    }
  }

  initForm(): void {
    this.jobForm = this.formBuilder.group({
      title: [this.job?.title || '', [Validators.required, Validators.maxLength(100)]],
      description: [this.job?.description || '', [Validators.required, Validators.maxLength(5000)]],
      location: [this.job?.location || '', [Validators.required, Validators.maxLength(100)]],
      salaryRange: [this.job?.salaryRange || '', Validators.maxLength(50)],
      jobType: [this.job?.jobType || 'full-time', Validators.required],
      requirements: [this.job?.requirements || '', Validators.maxLength(2000)],
      status: [this.job?.status || 'active']
    });
  }

  updateForm(): void {
    if (this.job) {
      this.jobForm.patchValue({
        title: this.job.title || '',
        description: this.job.description || '',
        location: this.job.location || '',
        salaryRange: this.job.salaryRange || '',
        jobType: this.job.jobType || 'full-time',
        requirements: this.job.requirements || '',
        status: this.job.status || 'active'
      });
    }
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.jobForm.controls).forEach(key => {
        const control = this.jobForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const jobRequest: JobRequest = this.jobForm.value;
    this.formSubmit.emit(jobRequest);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.jobForm.controls; }
}
