import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToasterNotificationService } from '../../shared/services/notifications/toaster-notification.service';
import { ToasterType } from '../../shared/models/notifications/toaster-type';
import { TokenService } from './services/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const toasterNotificationService = inject(ToasterNotificationService);
  const router = inject(Router);

  if (tokenService.isAuthenticated.value)
    return true;

  toasterNotificationService.showToaster({
    type: ToasterType.Error,
    messageKey: 'auth.need-login'
  });
  
  router.navigate(['/login'], {
    queryParams: {
      returnUrl: state.url
    }
  });
  return false;
};
