import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Generic GET request
   * @param endpoint API endpoint
   * @param params Query parameters
   * @param requiresAuth Whether the request requires authentication
   * @returns Observable of response
   */
  get<T>(endpoint: string, params?: any, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    const options = this.buildRequestOptions(params, requiresAuth);
    return this.http.get<T>(url, {
      headers: options.headers,
      params: options.params
    });
  }

  /**
   * Generic POST request
   * @param endpoint API endpoint
   * @param body Request body
   * @param requiresAuth Whether the request requires authentication
   * @returns Observable of response
   */
  post<T>(endpoint: string, body: any, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    const options = this.buildRequestOptions(null, requiresAuth);
    return this.http.post<T>(url, body, {
      headers: options.headers,
      params: options.params
    });
  }

  /**
   * Generic PUT request
   * @param endpoint API endpoint
   * @param body Request body
   * @param requiresAuth Whether the request requires authentication
   * @returns Observable of response
   */
  put<T>(endpoint: string, body: any, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    const options = this.buildRequestOptions(null, requiresAuth);
    return this.http.put<T>(url, body, {
      headers: options.headers,
      params: options.params
    });
  }

  /**
   * Generic DELETE request
   * @param endpoint API endpoint
   * @param requiresAuth Whether the request requires authentication
   * @returns Observable of response
   */
  delete<T>(endpoint: string, requiresAuth: boolean = true): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    const options = this.buildRequestOptions(null, requiresAuth);
    return this.http.delete<T>(url, {
      headers: options.headers,
      params: options.params
    });
  }

  /**
   * Build request options
   * @param params Query parameters
   * @param requiresAuth Whether the request requires authentication
   * @returns Request options
   */
  private buildRequestOptions(params?: any, requiresAuth: boolean = true): any {
    let httpParams = new HttpParams();
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Add query parameters
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }

    // Add authorization header
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        httpHeaders = httpHeaders.append('Authorization', `Bearer ${token}`);
      }
    }

    return {
      headers: httpHeaders,
      params: httpParams
    };
  }
}
