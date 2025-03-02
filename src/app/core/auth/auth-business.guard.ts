import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToasterNotificationService } from '../../shared/services/notifications/toaster-notification.service';
import { ToasterType } from '../../shared/models/notifications/toaster-type';
import { RoleService } from './services/role.service';
import { AccountType } from './models/account-type';

export const authBusinessGuard: CanActivateFn = (route, state) => {
  const roleService = inject(RoleService);
  const toasterNotificationService = inject(ToasterNotificationService);
  const router = inject(Router);

  const accountType = roleService.getAccountType();
  if (accountType == AccountType.Business)
    return true;

  toasterNotificationService.showToaster({
    type: ToasterType.Error,
    messageKey: 'auth.access-denied'
  });

  router.navigate(['/login'], {
    queryParams: {
      returnUrl: state.url
    }
  });
  return false;
};
