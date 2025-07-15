import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Initialize form
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['job_seeker', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    // Redirect if already logged in
    if (this.authService.checkAuth()) {
      this.router.navigate(['/']);
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    const registerRequest: RegisterRequest = {
      email: this.f['email'].value,
      password: this.f['password'].value,
      role: this.f['role'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value
    };

    this.authService.register(registerRequest)
      .subscribe({
        next: () => {
          this.snackBar.open('Registration successful', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/']);
        },
        error: error => {
          this.snackBar.open(error.error?.message || 'Registration failed', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.loading = false;
        }
      });
  }
}
