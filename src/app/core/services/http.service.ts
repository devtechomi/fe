import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HttpRequestParams } from '../models/http-request-params';
import { firstValueFrom, Observable } from 'rxjs';
import { API_URL } from '../../shared/injection-tokens';
import { ApiResponse } from '../models/api-response';
import { ToasterType } from '../../shared/models/notifications/toaster-type';
import { ToasterNotificationService } from '../../shared/services/notifications/toaster-notification.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private httpClient: HttpClient,
              @Inject(API_URL) private apiUrl: string,
              private toasterNotificationService: ToasterNotificationService) {
  }

  async get<T>(requestParams: Partial<HttpRequestParams>, showErrorMessage: boolean = true): Promise<T | Partial<ApiResponse>> {
    const options = this.buildOptions(requestParams);
    const request = this.httpClient.get<T>(options.url, {
      headers: options.httpHeaders,
      params: options.httpParams,
      withCredentials: requestParams.withCredentials
    });

    return await this.makeRequestAndCheckError(request, showErrorMessage);
  }

  async post<T>(requestParams: Partial<HttpRequestParams>, showErrorMessage: boolean = true): Promise<T | Partial<ApiResponse>> {
    const options = this.buildOptions(requestParams);
    const request = this.httpClient.post<T>(options.url, requestParams.body, {
      headers: options.httpHeaders,
      params: options.httpParams,
      withCredentials: requestParams.withCredentials
    });

    return await this.makeRequestAndCheckError(request, showErrorMessage);
  }

  async put<T>(requestParams: Partial<HttpRequestParams>, showErrorMessage: boolean = true): Promise<T | Partial<ApiResponse>> {
    const options = this.buildOptions(requestParams);
    const request = this.httpClient.put<T>(options.url, requestParams.body, {
      headers: options.httpHeaders,
      params: options.httpParams,
      withCredentials: requestParams.withCredentials
    });

    return await this.makeRequestAndCheckError(request, showErrorMessage);
  }

  async patch<T>(requestParams: Partial<HttpRequestParams>, showErrorMessage: boolean = true): Promise<T | Partial<ApiResponse>> {
    const options = this.buildOptions(requestParams);
    const request = this.httpClient.patch<T>(options.url, requestParams.body, {
      headers: options.httpHeaders,
      params: options.httpParams,
      withCredentials: requestParams.withCredentials
    });

    return await this.makeRequestAndCheckError(request, showErrorMessage);
  }

  async delete<T>(requestParams: Partial<HttpRequestParams>, showErrorMessage: boolean = true): Promise<T | Partial<ApiResponse>> {
    const options = this.buildOptions(requestParams);
    const request = this.httpClient.delete<T>(options.url, {
      headers: options.httpHeaders,
      params: options.httpParams,
      withCredentials: requestParams.withCredentials
    });

    return await this.makeRequestAndCheckError(request, showErrorMessage);
  }

  private buildOptions(requestParams: Partial<HttpRequestParams>): {
    url: string,
    httpHeaders: HttpHeaders | undefined,
    httpParams: HttpParams | undefined
  } {
    let url: string = requestParams.baseUrl ?? this.apiUrl;
    if (requestParams.controller != undefined) {
      url += `/${requestParams.controller}`;
    }
    if (requestParams.routes != undefined && requestParams.routes.length > 0) {
      url += `/${requestParams.routes.join('/')}`;
    }

    let httpHeaders: HttpHeaders | undefined;
    if (requestParams.headers != undefined) {
      httpHeaders = new HttpHeaders();
      Object.entries(requestParams.headers).forEach(([key, value]) => {
        if (value) {
          httpHeaders = httpHeaders!.append(key, value);
        }
      });
    }

    let httpParams: HttpParams | undefined;
    if (requestParams.queryStrings != undefined) {
      httpParams = new HttpParams();
      Object.entries(requestParams.queryStrings).forEach(([key, value]) => {
        if (value) {
          httpParams = httpParams!.append(key, value.toString());
        }
      });
    }

    return { url, httpHeaders, httpParams };
  }

  private async makeRequestAndCheckError<T>(request: Observable<T>, showErrorMessage: boolean = true): Promise<T | Partial<ApiResponse>> {
    try {
      const response = await firstValueFrom(request);
      return response;
    }
    catch (error: any) {
      // To ensure that the error is coming from our backend
      if (error && 'isSuccess' in error && 'statusCode' in error) {
        if (showErrorMessage) {
          if ('error' in error) {
            // If the error returned from the backend is an array,
            // it represents validation errors, which should be handled on the client
            if (!Array.isArray(error.error)) {
              this.toasterNotificationService.showToaster({
                type: ToasterType.Error,
                messageKey: error.error
              });
            }
            else {
              this.toasterNotificationService.showToaster({
                type: ToasterType.Error,
                messageKey: 'errors.wrong-data'
              });
            }
          }
          else {
            if (error.isSuccess) {
              this.toasterNotificationService.showToaster({
                type: ToasterType.Warning,
                messageKey: 'errors.global-error'
              });
            }
            else {
              this.toasterNotificationService.showToaster({
                type: ToasterType.Error,
                messageKey: 'errors.global-error'
              });
            }
          }
        }

        return error as Partial<ApiResponse>;
      }

      if (showErrorMessage) {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Error,
          messageKey: 'errors.global-error'
        });
      }

      return {
        isSuccess: false,
        statusCode: error.status,
        message: error.message
      }
    }
  }
}
