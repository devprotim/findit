import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Job, JobResponse, JobsResponse, JobRequest } from '../models/job.model';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private apiService: ApiService) { }

  /**
   * Get all jobs with filtering
   * @param params Query parameters
   * @returns Observable of jobs response
   */
  getJobs(params?: any): Observable<JobsResponse> {
    return this.apiService.get<JobsResponse>('jobs', params, false);
  }

  /**
   * Get job by ID
   * @param id Job ID
   * @returns Observable of job response
   */
  getJobById(id: number): Observable<JobResponse> {
    return this.apiService.get<JobResponse>(`jobs/${id}`, null, false);
  }

  /**
   * Create a new job
   * @param jobRequest Job request
   * @returns Observable of job response
   */
  createJob(jobRequest: JobRequest): Observable<JobResponse> {
    return this.apiService.post<JobResponse>('jobs', jobRequest);
  }

  /**
   * Update job
   * @param id Job ID
   * @param jobRequest Job request
   * @returns Observable of job response
   */
  updateJob(id: number, jobRequest: JobRequest): Observable<JobResponse> {
    return this.apiService.put<JobResponse>(`jobs/${id}`, jobRequest);
  }

  /**
   * Delete job
   * @param id Job ID
   * @returns Observable of response
   */
  deleteJob(id: number): Observable<any> {
    return this.apiService.delete<any>(`jobs/${id}`);
  }

  /**
   * Get jobs posted by the current employer
   * @param params Query parameters
   * @returns Observable of jobs response
   */
  getEmployerJobs(params?: any): Observable<JobsResponse> {
    return this.apiService.get<JobsResponse>('jobs/employer/me', params);
  }
}
