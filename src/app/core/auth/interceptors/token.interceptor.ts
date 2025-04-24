import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { API_URL } from '../../../shared/injection-tokens';
import { TokenService } from '../services/token.service';
import { ApiResponse } from '../../models/api-response';
import { Router } from '@angular/router';
import { ToasterNotificationService } from '../../../shared/services/notifications/toaster-notification.service';
import { ToasterType } from '../../../shared/models/notifications/toaster-type';
import { RoleService } from '../services/role.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = inject(API_URL);
  const tokenService = inject(TokenService);
  const roleService = inject(RoleService);
  const toasterNotificationService = inject(ToasterNotificationService);
  const router = inject(Router);

  if (!req.url.startsWith(apiUrl)) {
    return next(req);
  }
  
  const refreshTokenUrl = apiUrl + tokenService.refreshTokenEndpoint;
  const logoutUrl = apiUrl + tokenService.logoutEndpoint;
  if (req.url == refreshTokenUrl || req.url == logoutUrl) {
    return next(req);
  }

  const token = tokenService.getToken();
  const clonedRequest = req.clone({
    setHeaders: {
      'Authorization': tokenService.Bearer + token
    }
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if ((error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden) &&
            tokenService.isAuthenticated.value) {
        const hasPermission = error.status !== HttpStatusCode.Forbidden;
        return tokenService.requestForNewToken().pipe(
          switchMap((response: Partial<ApiResponse>) => {
            if (response.isSuccess) {
              tokenService.setToken(response.data.accessToken);
              roleService.setAccountType(response.data.accountType);

              const clonedReq = req.clone({
                setHeaders: {
                  'Authorization': tokenService.Bearer + tokenService.getToken()
                }
              });

              return next(clonedReq);
            }
            else {
              toasterNotificationService.showToaster({
                type: ToasterType.Error,
                messageKey: hasPermission ?
                  (tokenService.isAuthenticated.value ? 'auth.session-timeout' : 'auth.need-login') : 'auth.access-denied'
              });
              
              tokenService.clearToken();
              roleService.clearAccountType();
              router.navigate(['/login'], {
                queryParams: {
                  returnUrl: router.url
                }
              });
              return of();
            }
          }),
          catchError((err) => {
            toasterNotificationService.showToaster({
              type: ToasterType.Error,
              messageKey: hasPermission ?
                (tokenService.isAuthenticated.value ? 'auth.session-timeout' : 'auth.need-login') : 'auth.access-denied'
            });

            tokenService.clearToken();
            roleService.clearAccountType();
            router.navigate(['/login'], {
              queryParams: {
                returnUrl: router.url
              }
            });
            return of(err);
          })
        )
      }
      else {
        return throwError(() => error);
      }
    })
  );
};
