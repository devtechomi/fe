import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from '../../../core/services/localization.service';
import { ToasterNotificationService } from '../../../shared/services/notifications/toaster-notification.service';
import { downloadWarehousesExcel } from '../../../shared/utility/excel.util';

@Component({
  selector: 'app-initial-integration',
  imports: [
    MatButtonModule, MatDialogModule,
    TranslateModule
  ],
  templateUrl: './initial-integration.component.html',
  styleUrl: './initial-integration.component.scss'
})
export class InitialIntegrationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private localizationService: LocalizationService,
              private toasterNotificationService: ToasterNotificationService) {
  }

  async downloadExcel(): Promise<void> {
    await downloadWarehousesExcel(this.data,
                                  this.toasterNotificationService,
                                  this.localizationService,
                                  'integrations.initial.file-name',
                                  'integrations.initial.download-fail');
  }
}
