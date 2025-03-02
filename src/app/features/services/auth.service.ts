import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { ApiResponse } from '../../core/models/api-response';
import { HttpStatusCode } from '@angular/common/http';
import { ToasterNotificationService } from '../../shared/services/notifications/toaster-notification.service';
import { ToasterType } from '../../shared/models/notifications/toaster-type';
import { TokenService } from '../../core/auth/services/token.service';
import { RoleService } from '../../core/auth/services/role.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpService: HttpService,
              private tokenService: TokenService,
              private roleService: RoleService,
              private toasterNotificationService: ToasterNotificationService) {
  }

  async login(username: string, password: string): Promise<Partial<ApiResponse>> {
    const response: Partial<ApiResponse> = await this.httpService.post<Partial<ApiResponse>>({
      controller: 'auth',
      routes: ['login'],
      body: {
        username,
        password
      },
      withCredentials: true
    });
    
    // Status code is also needed to be checked because of the integartion process
    if (response.isSuccess && response.statusCode == HttpStatusCode.Ok) {
      this.tokenService.setToken(response.data.accessToken);
      this.roleService.setAccountType(response.data.accountType);
    }

    return response;
  }

  async integrate(username: string, password: string): Promise<Partial<ApiResponse>> {
    const response: Partial<ApiResponse> = await this.httpService.post<Partial<ApiResponse>>({
      controller: 'auth',
      routes: ['login', 'integrate'],
      body: {
        username,
        password
      },
      withCredentials: true
    });

    if (response.isSuccess) {
      this.tokenService.setToken(response.data.accessToken);
      this.roleService.setAccountType(response.data.accountType);
    }

    return response;
  }

  async logout(): Promise<Partial<ApiResponse>> {
    const response: Partial<ApiResponse> = await this.httpService.delete<Partial<ApiResponse>>({
      controller: 'auth',
      routes: ['logout'],
      withCredentials: true
    }, false);

    this.toasterNotificationService.showToaster({
      type: ToasterType.Info,
      messageKey: 'auth.logout-success'
    });

    this.tokenService.clearToken();
    this.roleService.clearAccountType();

    return response;
  }
}
