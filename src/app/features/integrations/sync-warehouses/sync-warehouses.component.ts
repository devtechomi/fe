import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from '../../../core/services/localization.service';
import { ToasterNotificationService } from '../../../shared/services/notifications/toaster-notification.service';
import { downloadWarehousesExcel } from '../../../shared/utility/excel.util';

@Component({
  selector: 'app-sync-warehouses',
  imports: [
    MatButtonModule, MatDialogModule,
    TranslateModule
  ],
  templateUrl: './sync-warehouses.component.html',
  styleUrl: './sync-warehouses.component.scss'
})
export class SyncWarehousesComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private localizationService: LocalizationService,
              private toasterNotificationService: ToasterNotificationService) {
  }

  async downloadExcel(): Promise<void> {
    await downloadWarehousesExcel(this.data.newWarehouses,
                                  this.toasterNotificationService,
                                  this.localizationService,
                                  'integrations.sync.file-name',
                                  'integrations.sync.download-fail');
  }
}
