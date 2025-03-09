import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { Warehouse } from '../../../../core/contracts/warehouse';
import { BusinessService } from '../../../services/business.service';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { flattenJson } from '../../../../shared/utility/excel.util';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LocalizedPaginationService } from '../../../../shared/services/localized-pagination.service';
import { MatMenuModule } from '@angular/material/menu';
import { ApiResponse } from '../../../../core/models/api-response';
import { AccountService } from '../../../services/account.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { IntegrationDialogs } from '../../../integrations/integrations';
import { ToasterNotificationService } from '../../../../shared/services/notifications/toaster-notification.service';
import { ToasterType } from '../../../../shared/models/notifications/toaster-type';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GeneratedPasswordsComponent } from '../../dialogs/generated-passwords/generated-passwords.component';
import { UpdateUserPasswordComponent } from '../../dialogs/update-user-password/update-user-password.component';
import { UniqueJsonArray } from '../../../../shared/utility/unique-json-array';
import { moveElementToFront } from '../../../../shared/utility/array.util';
import { TokenService } from '../../../../core/auth/services/token.service';

@Component({
  selector: 'app-warehouses',
  imports: [
    MatTableModule,
    MatInputModule, MatButtonModule, MatIconModule, FormsModule,
    MatPaginatorModule,
    TranslateModule,
    LoadingComponent,
    MatButtonModule, MatMenuModule,
    MatCheckboxModule
],
  providers: [
    { provide: MatPaginatorIntl, useClass: LocalizedPaginationService }
  ],
  templateUrl: './warehouses.component.html',
  styleUrl: './warehouses.component.scss'
})
export class WarehousesComponent implements OnInit {
  private readonly firstPage: number = 1;
  private readonly defaultPageSize: number = 20;

  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;
  @ViewChild(MatPaginatorModule) paginator!: MatPaginatorModule;
  
  public searchText: string = '';

  public columnNames: string[] = [
    'select',
    'name',
    'username',
    'type', 
    'erpCode', 
    'address-city', 
    'address-district', 
    'address-street', 
    'contact-name', 
    'contact-email', 
    'contact-phone', 
    'manage'
  ]
  public tableData: MatTableDataSource<Warehouse> = new MatTableDataSource<Warehouse>();
  public selection = new SelectionModel<Warehouse>(true, []);
  public selectedRows: UniqueJsonArray<Warehouse> = new UniqueJsonArray<Warehouse>('erpCode');

  public count: number = 0;
  private currentPage: number = this.firstPage;
  private pageSize: number = this.defaultPageSize;

  public showSendPassword: boolean = localStorage.getItem('password') ? true : false;

  constructor(private accountService: AccountService,
              private businessService: BusinessService,
              private tokenService: TokenService,
              private dialogService: DialogService,
              private toasterNotificationService: ToasterNotificationService) {
  }

  ngOnInit(): void {
    if (!this.tokenService.isAuthenticated.value)
      return;
    
    this.accountService.getWarehouses(this.firstPage, this.defaultPageSize).then((response) => {
      this.fillTable(response);
      this.loadingComponent.changeState(false, false);
    });
  }

  fillTable(response: Partial<ApiResponse>) {
    let warehouses: Warehouse[] = [];
    response.data.forEach((item: any) => {
      let warehouse = flattenJson(item.warehouse);
      warehouse.username = item.username;
      warehouses.push(warehouse);
    });

    // Sadece "SuperUser" olmayanları filtrele
    warehouses = warehouses.filter(warehouse => warehouse.type !== 'SuperUser');

    const mainWarehouse = warehouses.find(w => w.type == 'MainWarehouse');
    if (mainWarehouse) {
      moveElementToFront(warehouses, mainWarehouse);
    }
    
    this.tableData = new MatTableDataSource<Warehouse>(warehouses);
    this.count = response.metadata.count;
  }

  isAllSelected() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const currentPageData = this.tableData.data.slice(startIndex, endIndex);

    const numSelected = this.selection.selected.length;
    const numRows = currentPageData.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedRows.clear();
      return;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const currentPageData = this.tableData.data.slice(startIndex, endIndex);

    this.selection.select(...currentPageData);
    this.selectedRows.addRange(currentPageData);
  }

  toggleRow(row: Warehouse) {
    if (this.selection.isSelected(row)) {
      this.selectedRows.remove(row);
    }
    else {
      this.selectedRows.add(row);
    }

    this.selection.toggle(row);
  }

  async onSearchClicked() {
    this.loadingComponent.changeState(true, false);
    
    this.currentPage = this.firstPage;
    const response = await this.accountService.getWarehouses(this.firstPage, this.pageSize, this.searchText);
    this.fillTable(response);

    this.loadingComponent.changeState(false, false);
  }

  async onSearchClearClicked() {
    this.searchText = '';
    await this.onSearchClicked();
  }

  async onPageChanged(event: PageEvent) {
    this.loadingComponent.changeState(true, false);

    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    const response = await this.accountService.getWarehouses(this.currentPage, this.pageSize, this.searchText);
    this.fillTable(response);

    this.loadingComponent.changeState(false, false);
  }

  async onGeneratePasswordsClicked() {
    // Dialog'u açmadan önce yükleme göstergesini açmıyoruz
    this.dialogService.openQuestionDialog({
      titleKey: 'business.warehouses.generate-password.confirm-header',
      messageKey: 'business.warehouses.generate-password.confirm-message',
      noButtonTextKey: 'actions.no',
      yesButtonTextKey: 'actions.yes',
      onYesClicked: () => {
        this.loadingComponent.changeState(true, false);
        
        try {
          const erpCodes = this.selectedRows.get().map(value => value.erpCode);
          this.businessService.generatePasswords(erpCodes).then((response) => {
            if (response.isSuccess && response.data.warehouses.length !== 0) {
              this.dialogService.openCustomDialog(GeneratedPasswordsComponent, {
                data: response.data
              });
            }
          });
        } catch (error) {
          // Hata yönetimi burada yapılabilir
          console.error('Password generation error:', error);
        } finally {
          // İşlem tamamlandığında yükleme göstergesini kapatıyoruz
          this.loadingComponent.changeState(false, false);
        }
      }
    });
  }

  async sendAllUSerNewPassword() {
    this.loadingComponent.changeState(true, false);
    const erpCodes = this.tableData.data.map(x => x.erpCode);
    const response = await this.businessService.sendAllUserNewPasswords(erpCodes)
    if (response.isSuccess) {
      this.toasterNotificationService.showToaster({
        type: ToasterType.Success,
        messageKey: 'integrations.sync.up-to-date'
      });
    } else {
      this.toasterNotificationService.showToaster({
        type: ToasterType.Error,
        messageKey: 'errors.global-error'
      });
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
        this.fillTable(warehousesResponse);
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
            localStorage.setItem('password', data);
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
  sendPassword(email: string) {  
    const password = localStorage.getItem('password');

    if (!email || !password) {
      this.toasterNotificationService.showToaster({
        type: ToasterType.Error,
        messageKey: 'business.warehouses.send-password.no-email'
      });
      return;
    }

    this.dialogService.openQuestionDialog({
      titleKey: 'business.warehouses.send-password.confirm-header',
      messageKey: 'business.warehouses.send-password.confirm-message',
      noButtonTextKey: 'actions.no',
      yesButtonTextKey: 'actions.yes',
      onYesClicked: () => {
        this.loadingComponent.changeState(true, false);
        this.businessService.sendUserPassword(email, password).then((response) => {
          if (response.isSuccess) {
            this.toasterNotificationService.showToaster({
              type: ToasterType.Success,
              messageKey: 'business.warehouses.send-password.success'
            });
          }
          this.loadingComponent.changeState(false, false);
        });
      }
    });
  }
}
