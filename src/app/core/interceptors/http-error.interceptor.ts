import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { API_URL } from '../../shared/injection-tokens';
import { ToasterNotificationService } from '../../shared/services/notifications/toaster-notification.service';
import { ToasterType } from '../../shared/models/notifications/toaster-type';
import { TokenService } from '../auth/services/token.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);
  const tokenService = inject(TokenService);
  const toasterNotificationService = inject(ToasterNotificationService);

  if (!req.url.startsWith(apiUrl)) {
    return next(req);
  }

  const refreshTokenUrl = apiUrl + tokenService.refreshTokenEndpoint;
  if (req.url == refreshTokenUrl) {
    return next(req);
  }
  
  return next(req).pipe(
    tap((value) => {
      if ('body' in value) {
        const body = value.body as { error?: any }
        if ('error' in body) {
          toasterNotificationService.showToaster({
            type: ToasterType.Info,
            messageKey: body.error
          });
        }
      }
    }),
    catchError((error) => {
      return throwError(() => error.error);
    })
  );
};
