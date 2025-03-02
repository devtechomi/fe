import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { LocalizationService } from '../../../../core/services/localization.service';
import { ToasterNotificationService } from '../../../../shared/services/notifications/toaster-notification.service';
import { downloadWarehousesExcel } from '../../../../shared/utility/excel.util';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-generated-passwords',
  imports: [
    MatButtonModule, MatDialogModule,
    TranslateModule
  ],
  templateUrl: './generated-passwords.component.html',
  styleUrl: './generated-passwords.component.scss'
})
export class GeneratedPasswordsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private localizationService: LocalizationService,
              private toasterNotificationService: ToasterNotificationService) {
  }

  async downloadExcel(): Promise<void> {
    await downloadWarehousesExcel(this.data.warehouses,
                                  this.toasterNotificationService,
                                  this.localizationService,
                                  'business.warehouses.generate-passwords.file-name',
                                  'business.warehouses.generate-passwords.download-fail');
  }
}
