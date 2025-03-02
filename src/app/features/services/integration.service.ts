import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  /** 
   * This is used to show popup(s) to the business account types if an integration happens during login.
   * It holds the payload(s) coming from each integration.
   */
  private integrationData: { name: string, data: any }[] = [];

  initialize(loginResponse: any): void {
    if (loginResponse.metadata) {
      for (const key in loginResponse.metadata) {
        this.integrationData.push({
          name: key,
          data: loginResponse.metadata[key]
        });
      }
    }
  }

  popIntegrationData(): { name: string, data: any } | undefined {
    return this.integrationData.pop();
  }
}
