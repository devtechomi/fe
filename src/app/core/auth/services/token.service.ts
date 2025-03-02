import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from '../../../shared/injection-tokens';
import { ApiResponse } from '../../models/api-response';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  readonly refreshTokenEndpoint = '/auth/refresh';
  readonly logoutEndpoint = '/auth/logout';
  readonly Bearer = 'Bearer ';
  
  private readonly tokenStorageKey = 'token';
  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient,
              @Inject(API_URL) private apiUrl: string) {
    this.isAuthenticated.next(localStorage.getItem(this.tokenStorageKey) != null);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
    this.isAuthenticated.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenStorageKey);
    this.isAuthenticated.next(false);
  }

  requestForNewToken(): Observable<Partial<ApiResponse>> {
    return this.httpClient.put<Partial<ApiResponse>>(this.apiUrl + this.refreshTokenEndpoint, null, {
      withCredentials: true
    });
  }

  getDecodedToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Geçersiz JWT formatı');
      }

      // Base64Url'i Base64'e dönüştür
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      // Padding ekle
      const padding = '='.repeat((4 - base64Payload.length % 4) % 4);
      const normalizedBase64 = base64Payload + padding;

      // Base64'ten decode et ve JSON'a çevir
      const decodedPayload = atob(normalizedBase64);
      const payload = JSON.parse(decodedPayload);
      
      // Sadece nameidentifier'ı dön
      return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    } catch (error) {
      console.error('Token decode hatası:', error);
      return null;
    }
  }
}
