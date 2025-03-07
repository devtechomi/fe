import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { ApiResponse } from '../../core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  constructor(private httpService: HttpService) {
  }

  async sync(): Promise<Partial<ApiResponse>> {
    return await this.httpService.post({
      controller: 'business',
      routes: ['warehouses', 'sync']
    });
  }

  async generatePasswords(erpCodes: string[]): Promise<Partial<ApiResponse>> {
    return await this.httpService.patch({
      controller: 'business',
      routes: ['password', 'generate'],
      body: {
        erpCodes
      }
    });
  }

  async sendAllUserNewPasswords(erpCodes: string[]): Promise<Partial<ApiResponse>> {
    return await this.httpService.patch({
      controller: 'api/email',
      routes: ['password', 'sendEmailAll'],
      body: {
        erpCodes
      }
    });
  }

  async updateUserPassword(erpCode: string, password: string): Promise<Partial<ApiResponse>> {
    return await this.httpService.patch({
      controller: 'business',
      routes: ['password', 'user'],
      body: {
        erpCode,
        password
      }
    });
  }

  async sendUserPassword(email: string, password: string): Promise<Partial<ApiResponse>> {
    return await this.httpService.post({
      controller: 'api/Email',
      body: {
        recipientEmail: 'saitramazangl@gmail.com',
        password
      }
    });
  }

  async submitUserPermissions(selectedUsers: any[]): Promise<Partial<ApiResponse>> {
    
    return await this.httpService.post({
      controller: 'api/permission',
      body: selectedUsers[0]
    });
  }

  async getAllPermissions(): Promise<Partial<ApiResponse>> {
    return await this.httpService.get({
      controller: 'api/Permission',
    });
  }

  async submitAllUserPermissions(selectedUsers: any[]): Promise<Partial<ApiResponse>> {
    return await this.httpService.post({
      controller: 'api/permission/all',
      body: selectedUsers
    });
  }
}
