import { Job } from './job.model';
import { User, Profile } from './user.model';

export interface Application {
  id?: number;
  jobId: number;
  applicantId: number;
  status: 'applied' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
  coverLetter?: string;
  createdAt?: Date;
  updatedAt?: Date;
  job?: Job;
  applicant?: {
    id: number;
    email: string;
    profile?: Profile;
  };
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: {
    application: Application;
  };
}

export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    applications: Application[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface ApplicationRequest {
  jobId: number;
  coverLetter?: string;
}

export interface ApplicationStatusRequest {
  status: 'applied' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
}
