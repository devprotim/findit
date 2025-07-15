export interface User {
  id?: number;
  email: string;
  role: 'job_seeker' | 'employer';
}

export interface Profile {
  id?: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  resumeUrl?: string;
  companyName?: string;
  companyDescription?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'job_seeker' | 'employer';
  firstName?: string;
  lastName?: string;
}
