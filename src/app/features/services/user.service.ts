import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { ApiResponse } from '../../core/models/api-response';
import { Permission } from '../../core/contracts/permission';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpService: HttpService) {
  }

  async sendBoxes(transfers: {
      erpCode: string,
      deliveryNote: string,
      boxCode: string,
      quantity: number,
      boxStatus: 'full' | 'empty'
    }[]): Promise<Partial<ApiResponse>> {
    return await this.httpService.post({
      controller: 'user',
      routes: ['send-boxes'],
      body: {
        transfers
      }
    })
  }

  async getUserPermissions(userId: string): Promise<Permission> {
    const response = await this.httpService.get({
      controller: `api/Permission/${userId}`,
    });
    return response as Permission;
  }
}
