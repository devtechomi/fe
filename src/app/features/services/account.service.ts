import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { ApiResponse } from '../../core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private httpService: HttpService) {
  }

  async getMyData(): Promise<Partial<ApiResponse>> {
    return await this.httpService.get({
      controller: 'account'
    });
  }

  async getWarehouses(page: number, pageSize: number, searchText?: string | null): Promise<Partial<ApiResponse>> {
    return await this.httpService.get({
      controller: 'account',
      routes: ['warehouses'],
      queryStrings: {
        page,
        pageSize,
        searchText: searchText ?? null
      }
    });
  }

  async getBoxes(page: number, pageSize: number, searchText?: string | null): Promise<Partial<ApiResponse>> {
    return await this.httpService.get({
      controller: 'account',
      routes: ['boxes'],
      queryStrings: {
        page,
        pageSize,
        searchText: searchText ?? null
      }
    });
  }

  async getAllBoxes(): Promise<Partial<ApiResponse>> {
    return await this.httpService.get({
      controller: 'account',
      routes: ['boxes', 'all']
    });
  }

  async syncBoxes(): Promise<Partial<ApiResponse>> {
    return await this.httpService.post({
      controller: 'account',
      routes: ['boxes', 'sync']
    });
  }
}
