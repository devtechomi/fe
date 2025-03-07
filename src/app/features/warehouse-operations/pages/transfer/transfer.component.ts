import { Component, ViewChild } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Warehouse } from '../../../../core/contracts/warehouse';
import { SelectionModel } from '@angular/cdk/collections';
import { AccountService } from '../../../services/account.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { ToasterNotificationService } from '../../../../shared/services/notifications/toaster-notification.service';
import { ApiResponse } from '../../../../core/models/api-response';
import { flattenJson } from '../../../../shared/utility/excel.util';
import { UniqueJsonArray } from '../../../../shared/utility/unique-json-array';
import { moveElementToFront } from '../../../../shared/utility/array.util';
import { SendBoxesComponent } from '../../dialogs/send-boxes/send-boxes.component';
import { Box } from '../../../../core/contracts/box';
import { ToasterType } from '../../../../shared/models/notifications/toaster-type';
import { TokenService } from '../../../../core/auth/services/token.service';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Permission } from '../../../../core/contracts/permission';

@Component({
  selector: 'app-transfer',
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss'
})
export class TransferComponent implements OnInit {
  public boxes: Box[] | null = null;
  public sendBoxData: {
    warehouse: Warehouse,
    boxCode: string | null,
    quantity: number | null,
    deliveryNote: string | null,
    boxStatus: 'full' | 'empty' | null
  }[] = [];

  public isLoading: boolean = false;
  public isSyncing: boolean = false;
  public isSending: boolean = false;
  public userPermissions: Permission | null = null;
  public selectedTransferType: string | null = null;
  public selectedWarehouses: Warehouse[] = [];
  public warehouses: Warehouse[] = [];
  public permissionLoaded: boolean = false;
  public filteredWarehouses: Warehouse[] = [];

  constructor(
    private accountService: AccountService,
    private tokenService: TokenService,
    private userService: UserService,
    private toasterNotificationService: ToasterNotificationService
  ) {}

  ngOnInit(): void {
    if (!this.tokenService.isAuthenticated.value) return;
    this.loadInitialData();
  }

  private async loadInitialData() {
    await this.loadBoxes();
    await this.loadPermissions();
    await this.loadWarehouses();
    
    // Yetki kontrolü
    if (!this.hasAnyPermission()) {
        this.permissionLoaded = true; // Yetki yoksa ekranı güncelle
    }
  }

  private async loadBoxes() {
    if (this.boxes == null) {
      const response = await this.accountService.getAllBoxes();
      if (response.isSuccess) {
        this.boxes = response.data;
      }
    }
  }

  private async loadPermissions() {
    try {
      const userId = this.tokenService.getDecodedToken();
      if (userId) {
        const response = await this.userService.getUserPermissions(userId);
        this.userPermissions = response;
        this.permissionLoaded = true;
      }
    } catch (error) {
      console.error('Yetki bilgileri alınamadı:', error);
      this.permissionLoaded = true;
    }
  }

  private async loadWarehouses() {
    const response = await this.accountService.getWarehouses(1, 1000);
    if (response.isSuccess) {
      this.warehouses = response.data.map((item: any) => {
        let warehouse = flattenJson(item.warehouse);
        warehouse.username = item.username;
        return warehouse;
      });
    }
  }

  onTransferTypeChange(value: string) {
    this.selectedTransferType = value;
    
    if (value === 'ReturnToWarehouse') {
      const mainWarehouse = this.warehouses.find(w => w.type === 'MainWarehouse');
      if (mainWarehouse) {
        this.selectedWarehouses = [mainWarehouse];
        this.onWarehouseSelectionChange();
        this.sendBoxData.forEach(item => {
          item.boxStatus = 'empty';
        });
      }
    } else {
      this.selectedWarehouses = [];
      this.sendBoxData = [];
      this.sendBoxData.forEach(item => {
        item.boxStatus = 'full';
      });
    }
  }

  isMainWarehouseDisabled(): boolean {
    return this.selectedTransferType === 'ReturnToWarehouse' && this.selectedWarehouses.length > 0;
  }

  hasAnyPermission(): boolean {
    if (!this.userPermissions) return false;
    return this.userPermissions.returnToWarehouse || this.userPermissions.returnToMainWarehouse;
  }

  onWarehouseSelectionChange() {
    this.sendBoxData = this.selectedWarehouses.map(warehouse => ({
      warehouse: warehouse,
      boxCode: null,
      quantity: null,
      deliveryNote: this.generateRandomDeliveryNote(),
      boxStatus: this.selectedTransferType === 'ReturnToWarehouse' ? 'empty' : 'full'
    }));

    if (this.selectedWarehouses.length === 1) {
      const selectedWarehouse = this.selectedWarehouses[0];
      if (this.boxes && this.boxes.length === 1) {
        this.sendBoxData[0].boxCode = this.boxes[0].code;
      }
    }
  }

  private generateRandomDeliveryNote(): string {
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    return `logd-${randomNumber}`;
  }

  async onSyncBoxesClicked() {
    this.isSyncing = true;
    await this.syncBoxes();
    this.isSyncing = false;
  }

  public async syncBoxes() {
    const syncResponse = await this.accountService.syncBoxes();
    if (syncResponse.isSuccess) {
      if (syncResponse.data.numberofChanges != 0) {
        const boxesResponse = await this.accountService.getAllBoxes();
        this.boxes = boxesResponse.data;
        this.toasterNotificationService.showToaster({
          type: ToasterType.Success,
          messageKey: 'warehouse-operations.boxes.success'
        });
      } else {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Success,
          messageKey: 'warehouse-operations.boxes.up-to-date'
        });
      }
    }
  }

  canSend(): boolean {
    if (!this.selectedTransferType || this.sendBoxData.length === 0) return false;

    for (const item of this.sendBoxData) {
      if (!item.boxCode || !item.deliveryNote || !item.boxStatus) return false;
      if (item.quantity == null || item.quantity < 3 || item.quantity % 1 !== 0) return false;
    }

    return true;
  }

  async onSendClicked() {
    this.isLoading = true;
    this.isSending = true;

    const transfers = this.sendBoxData.map((value) => {
      return {
        erpCode: value.warehouse.erpCode,
        deliveryNote: value.deliveryNote ?? '',
        boxCode: value.boxCode ?? '',
        quantity: value.quantity ?? 0,
        boxStatus: value.boxStatus ?? 'full'
      }
    });
    
    const response = await this.userService.sendBoxes(transfers);
    this.isLoading = false;
    this.isSending = false;

    if (response.isSuccess) {
      this.toasterNotificationService.showToaster({
        type: ToasterType.Success,
        messageKey: 'warehouse-operations.transfer.send-boxes-dialog.success'
      });
      
      this.selectedTransferType = null;
      this.selectedWarehouses = [];
      this.sendBoxData = [];
    }
  }

  isWarehouseSelectionDisabled(): boolean {
    return !this.hasAnyPermission() || !this.selectedTransferType;
  }
}
