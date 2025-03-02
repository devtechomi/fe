import { Injectable, Injector } from '@angular/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { ToasterConfig } from '../../models/notifications/toaster-config';
import { LocalizationService } from '../../../core/services/localization.service';
import { ToasterPosition } from '../../models/notifications/toaster-position';

@Injectable({
  providedIn: 'root'
})
export class ToasterNotificationService {
  constructor(private toastr: ToastrService,
              private injector: Injector) {
  }

  async showToaster(config: Partial<ToasterConfig>): Promise<ActiveToast<any>> {
    const localizationService = this.injector.get(LocalizationService);

    let title = undefined;
    if (config.titleKey) {
      title = await localizationService.getLocalizedText(config.titleKey);
    }
    
    const message = await localizationService.getLocalizedText(config.messageKey!);
    
    return this.toastr[config.type!](message, title, {
      positionClass: config.position ?? ToasterPosition.BottomRight,
      disableTimeOut: config.disableTimeOut,
      timeOut: config.timeOut ?? 5000,
      tapToDismiss: true,
      closeButton: true,
      newestOnTop: false
    });
  }

  closeToaster(toaster: ActiveToast<any>): void {
    this.toastr.clear(toaster.toastId);
  }

  closeAllToasters(): void {
    this.toastr.clear();
  }
}
