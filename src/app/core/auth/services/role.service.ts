import { Injectable } from '@angular/core';
import { AccountType } from '../models/account-type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private readonly accountTypeStorageKey = 'accountType';
  private readonly accountInfo = 'user-info';


  setAccountType(accountType: AccountType): void {
    localStorage.setItem(this.accountTypeStorageKey, accountType);
  }

  getAccountType(): AccountType | null {
    const accountType = localStorage.getItem(this.accountTypeStorageKey);
    if (accountType) {
      return accountType as AccountType;
    }

    return null;
  }

  getAccountTypeString(): string | null {
    return localStorage.getItem(this.accountTypeStorageKey);
  }

  clearAccountType(): void {
    localStorage.removeItem(this.accountTypeStorageKey);
    localStorage.removeItem(this.accountInfo);
  }
}
