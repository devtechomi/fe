import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Warehouse } from '../../../../core/contracts/warehouse';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransferComponent } from '../../pages/transfer/transfer.component';
import { UserService } from '../../../services/user.service';
import { ToasterNotificationService } from '../../../../shared/services/notifications/toaster-notification.service';
import { ToasterType } from '../../../../shared/models/notifications/toaster-type';
import { moveElementToFront } from '../../../../shared/utility/array.util';
import { Permission } from '../../../../core/contracts/permission';
import { TokenService } from '../../../../core/auth/services/token.service';
import { AccountService } from '../../../services/account.service';
import { flattenJson } from '../../../../shared/utility/excel.util';
import { MatIconModule } from '@angular/material/icon';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-send-boxes',
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule, MatDialogModule,
    FormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './send-boxes.component.html',
  styleUrl: './send-boxes.component.scss'
})
export class SendBoxesComponent implements OnInit {
  public sendBoxData: {
    warehouse: Warehouse,
    boxCode: string | null,
    quantity: number | null,
    deliveryNote: string | null,
    boxStatus: 'full' | 'empty' | null,
    isDeliveryNoteFocused?: boolean
  }[] = [];

  public isLoading: boolean = false;
  public isSyncing: boolean = false;
  public isSending: boolean = false;
  public isRequired: boolean = false;
  public transferComponent!: TransferComponent;
  public userPermissions: Permission | null = null;
  public selectedTransferType: string | null = null;

  public permissionLoaded: boolean = false;

  public warehouses: Warehouse[] = [];
  public selectedWarehouses: Warehouse[] = [];

  public warehouseFilterCtrl: FormControl = new FormControl();
  public filteredWarehouses: Observable<Warehouse[]>;

  constructor(private dialogRef: MatDialogRef<SendBoxesComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private userService: UserService,
              private accountService: AccountService,
              private tokenService: TokenService,
              private toasterNotificationService: ToasterNotificationService) {
    
    // Artık depo seçimi modal içinde yapılacak
    // const warehouses = data.selectedWarehouses.get(); // Bu kısmı kaldırıyoruz
    
    // sendBoxData başlangıçta boş array olacak
    this.sendBoxData = [];
    
    this.transferComponent = data.component;

    // Filtreleme için observable oluştur
    this.filteredWarehouses = this.warehouseFilterCtrl.valueChanges.pipe(
      startWith(''),
      map(search => this.filterWarehouses(search))
    );
  }

  async ngOnInit() {
    await this.loadPermissions();
    await this.loadWarehouses();
    
    // Eğer tek bir permission varsa, otomatik olarak seç
    if (this.userPermissions) {
      if (this.userPermissions.returnToWarehouse && !this.userPermissions.returnToMainWarehouse) {
        this.onTransferTypeChange('ReturnToWarehouse');
      } else if (!this.userPermissions.returnToWarehouse && this.userPermissions.returnToMainWarehouse) {
        this.onTransferTypeChange('ReturnToMainWarehouse');
      }
    }

    // Kutuları kontrol et ve senkronize et
    if (!this.transferComponent.boxes || this.transferComponent.boxes.length === 0) {
      await this.onSyncBoxesClicked();
    }
  }

  private async loadPermissions() {
    const userId = this.tokenService.getDecodedToken();
    
    try {
        if (userId) {
            const response = await this.userService.getUserPermissions(userId);
            
            this.userPermissions = {
                returnToWarehouse: response.returnToWarehouse,
                returnToMainWarehouse: response.returnToMainWarehouse
            };
            
            // Eğer sadece bir permission varsa, onu otomatik seç
            if (this.userPermissions.returnToWarehouse && !this.userPermissions.returnToMainWarehouse) {
                this.selectedTransferType = 'ReturnToWarehouse';
            } else if (!this.userPermissions.returnToWarehouse && this.userPermissions.returnToMainWarehouse) {
                this.selectedTransferType = 'ReturnToMainWarehouse';
            }
            
            this.permissionLoaded = true;
        }
    } catch (error) {
        this.permissionLoaded = true;
        this.toasterNotificationService.showToaster({
            type: ToasterType.Error,
            messageKey: 'errors.permission-error'
        });
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

      const mainWarehouse = this.warehouses.find(w => w.type == 'MainWarehouse');
      if (mainWarehouse) {
        moveElementToFront(this.warehouses, mainWarehouse);
      }
    }
  }

  async onSyncBoxesClicked() {
    this.isLoading = true;
    this.isSyncing = true;
    this.dialogRef.disableClose = true;

    await this.transferComponent.syncBoxes();

    // Eğer sadece bir kutu varsa, otomatik olarak seç
    if (this.transferComponent.boxes && this.transferComponent.boxes.length === 1) {
        const singleBox = this.transferComponent.boxes[0];
        this.sendBoxData.forEach(data => {
            data.boxCode = singleBox.code;
        });
    }

    this.isLoading = false;
    this.isSyncing = false;
    this.dialogRef.disableClose = false;
  }

  hasAnyPermission(): boolean {
    if (!this.permissionLoaded || !this.userPermissions) {
      return false;
    }
    
    // API'den gelen permission değerlerini kontrol et
    return this.userPermissions.returnToWarehouse || this.userPermissions.returnToMainWarehouse;
  }

  onTransferTypeChange(value: string) {
    this.selectedTransferType = value;
    
    if (value === 'ReturnToWarehouse') {
        // Ana depoyu bul ve otomatik seç
        const mainWarehouse = this.warehouses.find(w => w.type === 'MainWarehouse');
        if (mainWarehouse) {
            this.selectedWarehouses = [mainWarehouse];
            this.onWarehouseSelectionChange();
        }
    } else {
        // ReturnToMainWarehouse seçildiğinde depo seçimini temizle
        this.selectedWarehouses = [];
        this.sendBoxData = [];
        // Arama kutusunu sıfırla
        this.warehouseFilterCtrl.setValue('');
    }
  }

  public canSend() {
    if (!this.hasAnyPermission() || !this.selectedTransferType) {
      return false;
    }

    if (this.isLoading)
      return false;

    for (const item of this.sendBoxData) {
      if (item.boxCode == null || item.boxCode == undefined)
        return false;
      if (item.deliveryNote == null || item.deliveryNote == undefined)
        return false;
      if (item.quantity == null || item.quantity < 1 || item.quantity % 1 !== 0)
        return false;
      if (item.boxStatus == null)
        return false;
    }

    return true;
  }

  async onSendClicked() {
    this.isLoading = true;
    this.isSending = true;
    this.dialogRef.disableClose = true;

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
    this.dialogRef.disableClose = false;

    if (response.isSuccess) {
      this.toasterNotificationService.showToaster({
        type: ToasterType.Success,
        messageKey: 'warehouse-operations.transfer.send-boxes-dialog.success'
      });

      this.dialogRef.close();
    }
  }

  onCloseClicked() {
    this.dialogRef.close();
  }

  generateUniqueDeliveryNote(): string {
    const timestamp = new Date().getTime();
    return `LOGD${timestamp}`;
  }

  onWarehouseSelectionChange() {
    // Seçilen depolar için yeni sendBoxData oluştur
    this.sendBoxData = this.selectedWarehouses.map(warehouse => {
      let boxCode = null;
      
      // Eğer tek kutu varsa otomatik seç
      if (this.transferComponent.boxes && this.transferComponent.boxes.length === 1) {
        boxCode = this.transferComponent.boxes[0].code;
      }

      return {
        warehouse: warehouse,
        boxCode: boxCode,
        quantity: 1, // Varsayılan miktar
        deliveryNote: this.generateUniqueDeliveryNote(),
        boxStatus: 'full', // Varsayılan kutu durumu
        isDeliveryNoteFocused: false
      };
    });

  }

  // Filtreleme fonksiyonu ekleyelim
  private filterWarehouses(search: string): Warehouse[] {
    if (!search) {
      return this.warehouses;
    }
    
    search = search.toLowerCase().trim();
    return this.warehouses.filter(warehouse => 
      warehouse.name.toLowerCase().includes(search)
    );
  }
}
