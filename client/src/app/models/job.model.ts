import { User, Profile } from './user.model';

export interface Job {
  id?: number;
  employerId: number;
  title: string;
  description: string;
  location: string;
  salaryRange?: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  requirements?: string;
  status: 'active' | 'closed';
  createdAt?: Date;
  updatedAt?: Date;
  employer?: {
    id: number;
    email: string;
    profile?: Profile;
  };
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: {
    job: Job;
  };
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Job[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface JobRequest {
  title: string;
  description: string;
  location: string;
  salaryRange?: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  requirements?: string;
  status?: 'active' | 'closed';
}
