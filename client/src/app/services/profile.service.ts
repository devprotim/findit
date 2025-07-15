import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Profile } from '../models/user.model';

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: Profile;
  };
}

export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  resumeUrl?: string;
  companyName?: string;
  companyDescription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private apiService: ApiService) { }

  /**
   * Get user profile
   * @returns Observable of profile response
   */
  getProfile(): Observable<ProfileResponse> {
    return this.apiService.get<ProfileResponse>('profile');
  }

  /**
   * Update user profile
   * @param profileData Profile update request
   * @returns Observable of profile response
   */
  updateProfile(profileData: ProfileUpdateRequest): Observable<ProfileResponse> {
    return this.apiService.put<ProfileResponse>('profile', profileData);
  }
}
