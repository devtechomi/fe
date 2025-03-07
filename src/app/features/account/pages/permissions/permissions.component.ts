import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LocalizedPaginationService } from '../../../../shared/services/localized-pagination.service';
import { ApiResponse } from '../../../../core/models/api-response';
import { Warehouse } from '../../../../core/contracts/warehouse';
import { SelectionModel } from '@angular/cdk/collections';
import { UniqueJsonArray } from '../../../../shared/utility/unique-json-array';
import { AccountService } from '../../../services/account.service';
import { BusinessService } from '../../../services/business.service';
import { TokenService } from '../../../../core/auth/services/token.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { ToasterNotificationService } from '../../../../shared/services/notifications/toaster-notification.service';
import { flattenJson } from '../../../../shared/utility/excel.util';
import { moveElementToFront } from '../../../../shared/utility/array.util';
import { GeneratedPasswordsComponent } from '../../../business/dialogs/generated-passwords/generated-passwords.component';
import { IntegrationDialogs } from '../../../integrations/integrations';
import { ToasterType } from '../../../../shared/models/notifications/toaster-type';
import { UpdateUserPasswordComponent } from '../../../business/dialogs/update-user-password/update-user-password.component';
import { PermissionRequest } from '../../../../core/models/permission-request.model';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

interface WarehousesByBusiness {
  businessId: string;
  businessName: string;
  warehouses: Warehouse[];
  dataSource: MatTableDataSource<Warehouse>;
  warehouseSelection: SelectionModel<Warehouse>;
  mainWarehouseSelection: SelectionModel<Warehouse>;
  count: number;
}

@Component({
  selector: 'app-permissions',
  imports: [
    MatTableModule,
    MatInputModule, MatButtonModule, MatIconModule, FormsModule,
    MatPaginatorModule,
    TranslateModule,
    LoadingComponent,
    MatButtonModule, MatMenuModule,
    MatCheckboxModule,
    CommonModule,
    MatExpansionModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: LocalizedPaginationService }
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PermissionsComponent implements OnInit {
  private readonly firstPage: number = 1;
  private readonly defaultPageSize: number = 20;

  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;
  @ViewChild(MatPaginatorModule) paginator!: MatPaginatorModule;
  
  public searchText: string = '';

  public columnNames: string[] = [
    'username',
    'returnToWarehouse',
    'returnToMainWarehouse',
    'submit'
  ];
  
  public warehousesByBusiness: WarehousesByBusiness[] = [];
  public allWarehouses: Warehouse[] = [];
  public selection = new SelectionModel<Warehouse>(true, []);
  public selectedRows: UniqueJsonArray<Warehouse> = new UniqueJsonArray<Warehouse>('erpCode');

  public count: number = 0;
  private currentPage: number = this.firstPage;
  private pageSize: number = this.defaultPageSize;
  public canShowThePage: boolean = false;
  public isAnyCheckboxChecked: boolean = false;
  public isSuser: boolean = false;

  constructor(private accountService: AccountService,
              private businessService: BusinessService,
              private tokenService: TokenService,
              private dialogService: DialogService,
              private toasterNotificationService: ToasterNotificationService) {
  }

  ngOnInit(): void {
    const accountType = localStorage.getItem('accountType');
    this.isSuser = accountType === 'SuperUser' ? true : false;
    this.canShowThePage = accountType === 'SuperUser' ? true : false;
  }

  ngAfterViewInit(): void {
    if(!this.isSuser)
      return

    if (!this.tokenService.isAuthenticated.value)
      return;

    const userType = localStorage.getItem('accountType')
    
    if (userType == 'SuperUser') {
      this.canShowThePage = true;
    }

    this.businessService.getAllPermissions().then((response) => {
      this.processWarehousesData(response);
      this.loadingComponent.changeState(false, false);
    });
  }

  processWarehousesData(response: any) {
    let warehouses: Warehouse[] = [];
    response.forEach((item: any) => {
      let warehouse = flattenJson(item.warehouse);
      warehouse.username = item.getMyDataParams.username;
      warehouse.userId = item.permission.userId;
      warehouse.returnToWarehouse = item.permission.returnToWarehouse;
      warehouse.returnToMainWarehouse = item.permission.returnToMainWarehouse;
      warehouse.businessId = item.getMyDataParams.business.externalId;
      warehouse.businessName = item.getMyDataParams.business.name;
      warehouses.push(warehouse);
    });
    
    // Warehouses'ları businessId'ye göre grupla
    this.groupWarehousesByBusiness(warehouses);
  }

  groupWarehousesByBusiness(warehouses: Warehouse[]) {
    // Önce clear yapalım
    this.warehousesByBusiness = [];
    // BusinessId'leri unique olarak al
    const businessIds = [...new Set(warehouses.map(w => w.businessId))];
    businessIds.forEach(businessId => {
      const businessWarehouses = warehouses.filter(w => w.businessId === businessId);
      const businessName = businessWarehouses[0]?.businessName || 'Unknown';
      
      // Ana depoyu öne al
      const mainWarehouse = businessWarehouses.find(w => w.type == 'MainWarehouse');
      if (mainWarehouse) {
        moveElementToFront(businessWarehouses, mainWarehouse);
      }
      
      const dataSource = new MatTableDataSource<Warehouse>(businessWarehouses);
      
      // Her business için ayrı SelectionModel oluştur
      const warehouseSelection = new SelectionModel<Warehouse>(true, []);
      const mainWarehouseSelection = new SelectionModel<Warehouse>(true, []);
      
      // Mevcut seçimleri ekle
      businessWarehouses.forEach(warehouse => {
        if (warehouse.returnToWarehouse) {
          warehouseSelection.select(warehouse);
        }
        if (warehouse.returnToMainWarehouse) {
          mainWarehouseSelection.select(warehouse);
        }
      });
      
      this.warehousesByBusiness.push({
        businessId,
        businessName,
        warehouses: businessWarehouses,
        dataSource,
        warehouseSelection,
        mainWarehouseSelection,
        count: businessWarehouses.length
      });
    });
  }

  async onSearchClicked() {
    this.loadingComponent.changeState(true, false);
    
    this.currentPage = this.firstPage;
    const response = await this.accountService.getWarehouses(this.firstPage, this.pageSize, this.searchText);
    this.processWarehousesData(response);

    this.loadingComponent.changeState(false, false);
  }

  async onSearchClearClicked() {
    this.searchText = '';
    await this.onSearchClicked();
  }

  async onPageChanged(event: PageEvent, businessId: string) {
    this.loadingComponent.changeState(true, false);

    // For now, we'll handle pagination on the client-side since we're grouping by business
    // In a real app, you might want to paginate each business group separately on the server
    
    this.loadingComponent.changeState(false, false);
  }

  isAllSelectedForColumn(column: string, businessGroup: WarehousesByBusiness) {
    const selectionModel = column === 'returnToWarehouse' ? 
      businessGroup.warehouseSelection : businessGroup.mainWarehouseSelection;
    
    const numSelected = businessGroup.warehouses.filter(row => selectionModel.isSelected(row)).length;
    const numRows = businessGroup.warehouses.length;
    
    return numSelected === numRows && numRows > 0;
  }

  toggleAllCheckboxes(column: string, businessGroup: WarehousesByBusiness) {
    // Select the appropriate model based on the column
    const selectionModel = column === 'returnToWarehouse' ? 
      businessGroup.warehouseSelection : businessGroup.mainWarehouseSelection;
    
    // Check if all items are already selected
    const allSelected = this.isAllSelectedForColumn(column, businessGroup);

    businessGroup.warehouses.forEach((row: Warehouse) => {
      // Update the checkbox state
      row[column] = !allSelected;
      
      // Update the selection model
      if (!allSelected) {
        selectionModel.select(row);
      } else {
        selectionModel.deselect(row);
      }
    });
  }

  submitRow(element: PermissionRequest) {
    const selectedUser: PermissionRequest = {
      userId: element.userId,
      returnToWarehouse: !!element.returnToWarehouse,
      returnToMainWarehouse: !!element.returnToMainWarehouse
    };
    
    this.businessService.submitUserPermissions([selectedUser]).then(response => {
      if (response.isSuccess) {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Success,
          messageKey: 'permissions.update.success'
        });
      } else {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Error,
          messageKey: 'permissions.update.error'
        });
      }
    });
  }

  saveAllForBusiness(businessGroup: WarehousesByBusiness) {
    const selectedPermissions: PermissionRequest[] = businessGroup.warehouses.map(element => ({
      userId: element['userId'] || '',
      returnToWarehouse: !!element.returnToWarehouse,
      returnToMainWarehouse: !!element.returnToMainWarehouse
    }));

    this.businessService.submitAllUserPermissions(selectedPermissions).then(response => {
      if (response.isSuccess) {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Success,
          messageKey: 'permissions.save.success'
        });
      } else {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Error,
          messageKey: 'permissions.save.error'
        });
      }
    }).catch(error => {
      console.error('Hata:', error);
      this.toasterNotificationService.showToaster({
        type: ToasterType.Error,
        messageKey: 'permissions.save.error'
      });
    });
  }

  saveAllSelected() {
    // Tüm business gruplarından tüm izinleri topla
    const selectedPermissions: PermissionRequest[] = [];
    
    this.warehousesByBusiness.forEach(businessGroup => {
      businessGroup.warehouses.forEach(element => {
        const permissionRequest: PermissionRequest = {
          userId: element['userId'] || '',
          returnToWarehouse: !!element.returnToWarehouse,
          returnToMainWarehouse: !!element.returnToMainWarehouse
        };
        selectedPermissions.push(permissionRequest);
      });
    });

    this.businessService.submitAllUserPermissions(selectedPermissions).then(response => {
      if (response.isSuccess) {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Success,
          messageKey: 'permissions.save.success'
        });
      } else {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Error,
          messageKey: 'permissions.save.error'
        });
      }
    }).catch(error => {
      console.error('Hata:', error);
      this.toasterNotificationService.showToaster({
        type: ToasterType.Error,
        messageKey: 'permissions.save.error'
      });
    });
  }

  async onGeneratePasswordsClicked() {
    this.loadingComponent.changeState(true, false);

    const erpCodes = this.allWarehouses.map(value => value.erpCode);
    const response = await this.businessService.generatePasswords(erpCodes)
    if (response.isSuccess) {
      if (response.data.warehouses.length != 0) {
        this.dialogService.openCustomDialog(GeneratedPasswordsComponent, {
          data: response.data
        });
      }
    }

    this.loadingComponent.changeState(false, false);
  }

  async onSyncClicked() {
    this.loadingComponent.changeState(true, false);

    const syncResponse = await this.businessService.sync();
    if (syncResponse.isSuccess) {
      if (syncResponse.data.newWarehouses.length != 0) {
        this.dialogService.openCustomDialog(IntegrationDialogs.find(item => item.name == 'sync')?.dialog, { 
          data: syncResponse.data
        });

        this.currentPage = this.firstPage;
        const warehousesResponse = await this.accountService.getWarehouses(this.currentPage, this.pageSize, this.searchText);
        this.processWarehousesData(warehousesResponse);
      }
      else {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Success,
          messageKey: 'integrations.sync.up-to-date'
        });
      }
    }
    
    this.loadingComponent.changeState(false, false);
  }

  changePassword(warehouse: Warehouse) {  
    this.dialogService.openCustomDialog(UpdateUserPasswordComponent, undefined, (data: any) => {
      if (data) {
        this.loadingComponent.changeState(true, false);
        this.businessService.updateUserPassword(warehouse.erpCode, data).then((response) => {
          if (response.isSuccess) {
            this.toasterNotificationService.showToaster({
              type: ToasterType.Success,
              messageKey: 'business.warehouses.update-password.success'
            });
          }

          this.loadingComponent.changeState(false, false);
        });
      }
    });
  }
}