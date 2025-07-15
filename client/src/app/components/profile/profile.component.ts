import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { ProfileService, ProfileUpdateRequest } from '../../services/profile.service';
import { User, Profile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: User | null = null;
  profile: Profile | null = null;
  loading = false;
  saving = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUserProfile();
  }

  initForm(): void {
    this.profileForm = this.formBuilder.group({
      // Common fields
      firstName: ['', [Validators.maxLength(50)]],
      lastName: ['', [Validators.maxLength(50)]],
      phone: ['', [Validators.maxLength(20)]],
      address: ['', [Validators.maxLength(100)]],

      // Job seeker fields
      resumeUrl: ['', [Validators.maxLength(255)]],

      // Employer fields
      companyName: ['', [Validators.maxLength(100)]],
      companyDescription: ['', [Validators.maxLength(1000)]]
    });
  }

  loadUserProfile(): void {
    this.loading = true;

    // Get current user from local storage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.user = JSON.parse(userJson);
    }

    // Get profile
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.data.profile;
        this.updateFormWithProfileData();
        this.loading = false;
      },
      error: (error) => {
        // If profile doesn't exist yet, that's okay
        if (error.status !== 404) {
          this.snackBar.open(error.error?.message || 'Error loading profile', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
        this.loading = false;
      }
    });
  }

  updateFormWithProfileData(): void {
    if (!this.profile) return;

    this.profileForm.patchValue({
      firstName: this.profile.firstName || '',
      lastName: this.profile.lastName || '',
      phone: this.profile.phone || '',
      address: this.profile.address || '',
      resumeUrl: this.profile.resumeUrl || '',
      companyName: this.profile.companyName || '',
      companyDescription: this.profile.companyDescription || ''
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.saving = true;

    const profileData: ProfileUpdateRequest = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
      phone: this.profileForm.get('phone')?.value,
      address: this.profileForm.get('address')?.value
    };

    // Add role-specific fields
    if (this.isJobSeeker()) {
      profileData.resumeUrl = this.profileForm.get('resumeUrl')?.value;
    } else if (this.isEmployer()) {
      profileData.companyName = this.profileForm.get('companyName')?.value;
      profileData.companyDescription = this.profileForm.get('companyDescription')?.value;
    }

    this.profileService.updateProfile(profileData).subscribe({
      next: (response) => {
        this.profile = response.data.profile;
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.saving = false;
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Error updating profile', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.saving = false;
      }
    });
  }

  isJobSeeker(): boolean {
    return this.user?.role === 'job_seeker';
  }

  isEmployer(): boolean {
    return this.user?.role === 'employer';
  }
}
