import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  Application,
  ApplicationResponse,
  ApplicationsResponse,
  ApplicationRequest,
  ApplicationStatusRequest
} from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private apiService: ApiService) { }

  /**
   * Apply for a job
   * @param applicationRequest Application request
   * @returns Observable of application response
   */
  applyForJob(applicationRequest: ApplicationRequest): Observable<ApplicationResponse> {
    return this.apiService.post<ApplicationResponse>('applications', applicationRequest);
  }

  /**
   * Get applications for a job (employer only)
   * @param jobId Job ID
   * @param params Query parameters
   * @returns Observable of applications response
   */
  getJobApplications(jobId: number, params?: any): Observable<ApplicationsResponse> {
    return this.apiService.get<ApplicationsResponse>(`applications/job/${jobId}`, params);
  }

  /**
   * Update application status (employer only)
   * @param id Application ID
   * @param statusRequest Status request
   * @returns Observable of application response
   */
  updateApplicationStatus(id: number, statusRequest: ApplicationStatusRequest): Observable<ApplicationResponse> {
    return this.apiService.put<ApplicationResponse>(`applications/${id}/status`, statusRequest);
  }

  /**
   * Get user's applications (job seeker only)
   * @param params Query parameters
   * @returns Observable of applications response
   */
  getUserApplications(params?: any): Observable<ApplicationsResponse> {
    return this.apiService.get<ApplicationsResponse>('applications/me', params);
  }

  /**
   * Get application by ID
   * @param id Application ID
   * @returns Observable of application response
   */
  getApplicationById(id: number): Observable<ApplicationResponse> {
    return this.apiService.get<ApplicationResponse>(`applications/${id}`);
  }
}
