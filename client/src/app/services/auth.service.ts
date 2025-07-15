import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated: Observable<boolean>;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!this.getUserFromStorage());
    this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Get current user value
   * @returns Current user
   */
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Login user
   * @param loginRequest Login request
   * @returns Observable of auth response
   */
  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/login', loginRequest, false)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.token, response.data.user);
          }
        })
      );
  }

  /**
   * Register user
   * @param registerRequest Register request
   * @returns Observable of auth response
   */
  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('auth/register', registerRequest, false)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.token, response.data.user);
          }
        })
      );
  }

  /**
   * Get current user profile
   * @returns Observable of auth response
   */
  getCurrentUser(): Observable<AuthResponse> {
    return this.apiService.get<AuthResponse>('auth/me')
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated
   * @returns True if user is authenticated
   */
  checkAuth(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * Check if user is an employer
   * @returns True if user is an employer
   */
  isEmployer(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'employer';
  }

  /**
   * Check if user is a job seeker
   * @returns True if user is a job seeker
   */
  isJobSeeker(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'job_seeker';
  }

  /**
   * Set session data
   * @param token JWT token
   * @param user User data
   */
  private setSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Get user from storage
   * @returns User from storage
   */
  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
