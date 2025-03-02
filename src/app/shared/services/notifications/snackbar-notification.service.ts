import { Inject, Injectable, Injector } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarConfig } from '../../models/notifications/snackbar-config';
import { SnackbarPosition, SnackbarPositionMap } from '../../models/notifications/snackbar-position';
import { SnackbarComponent } from '../../components/notifications/snackbar/snackbar.component';
import { LocalizationService } from '../../../core/services/localization.service';

@Injectable({
  providedIn: 'root'
})
export class SnackbarNotificationService {
  readonly loadingImagePath = '';

  constructor(@Inject(MatSnackBar) private snackbar: MatSnackBar,
              private injector: Injector) {
  }

  async showSnackbar(config: Partial<SnackbarConfig>): Promise<MatSnackBarRef<any>> {
    const localizationService = this.injector.get(LocalizationService);
    
    let position;
    if (config.position) {
      position = SnackbarPositionMap[config.position];
    }
    else {
      position = SnackbarPositionMap[SnackbarPosition.BottomCenter]
    }

    const message = await localizationService.getLocalizedText(config.messageKey!);
    
    return this.snackbar.openFromComponent(SnackbarComponent, {
      duration: config.duration,
      horizontalPosition: position.horizontal,
      verticalPosition: position.vertical,
      data: {
        message: message,
        isLoading: config.isLoading,
        buttonIcon: config.buttonIcon,
        buttonAction: config.buttonAction
      }
    });
  }

  closeSnackbar(snackbar: MatSnackBarRef<any>) {
    snackbar.dismiss();
  }
}
