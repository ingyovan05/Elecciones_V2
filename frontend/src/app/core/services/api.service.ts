
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: { params?: Record<string, any> }) {
    let params = new HttpParams();
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value as string);
        }
      });
    }
    return this.http.get<T>(url, { params });
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(url, body);
  }

  patch<T>(url: string, body: any) {
    return this.http.patch<T>(url, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(url);
  }
}
