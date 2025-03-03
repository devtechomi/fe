import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IntegrationService } from '../../../services/integration.service';
import { DialogService } from '../../../../shared/services/dialog.service';
import { IntegrationDialogs } from '../../../integrations/integrations';
import { Warehouse } from '../../../../core/contracts/warehouse';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizationService } from '../../../../core/services/localization.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";
import { AccountService } from '../../../services/account.service';
import { AccountType } from '../../../../core/auth/models/account-type';
import { MatDividerModule } from '@angular/material/divider';
import { flattenJson } from '../../../../shared/utility/excel.util';
import { TokenService } from '../../../../core/auth/services/token.service';
import { TransferComponent } from '../../../warehouse-operations/pages/transfer/transfer.component';
import { Permission } from '../../../../core/contracts/permission';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-overview',
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    LoadingComponent,
    MatDividerModule,
    TransferComponent
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;

  public isBusinessAccount: boolean = false;
  public welcomingText: string = '';
  public businessName: string = '';
  public pageHeader: string = 'Transfer Screen';
  public canShowTransferScreen: boolean = false;
  public userPermissions: Permission | null = null;
  public username: string = "";
  public isSuser: boolean = false;

  public columnNames: string[] = ['name', 'type', 'erpCode', 'address-city', 'address-district', 'address-street', 'contact-name', 'contact-email', 'contact-phone']
  public tableData: MatTableDataSource<Warehouse> = new MatTableDataSource<Warehouse>();

  constructor(private integrationService: IntegrationService,
              private accountService: AccountService,
              private tokenService: TokenService,
              private dialogService: DialogService,
              private userService: UserService,
              private localizationService: LocalizationService) {
  }

  ngOnInit(): void {
    const accountType = localStorage.getItem('accountType');
    this.isSuser = accountType === 'SuperUser' ? true : false;
  }

  ngAfterViewInit(): void {
    if(!this.isSuser) {
      if (this.tokenService.isAuthenticated.value) {
        this.accountService.getMyData().then(async (response) => {
          localStorage.setItem('user-info', JSON.stringify(response.data));
          this.username = response.data.business.name
          this.userPermissions = response.data.permissions;
          const userType = localStorage.getItem('accountType');
          if(userType === 'User') {
            const userId = this.tokenService.getDecodedToken();
            if (userId) {
              const response = await this.userService.getUserPermissions(userId);
              this.userPermissions = response;
              this.canShowTransferScreen = true;
              
            }
          }
          if (response.data.type == AccountType.Business) {
            const accountType = await this.localizationService.getLocalizedText('dashboard.overview.business-account');
            this.welcomingText = await this.localizationService.getLocalizedText('dashboard.overview.account-type-content', {
              name: response.data.business.name,
              type: accountType
            });
  
            this.isBusinessAccount = true;
            this.showNextIntegrationDialog();
          }
          else {
            const accountType = await this.localizationService.getLocalizedText('dashboard.overview.warehouse-account');
            this.welcomingText = await this.localizationService.getLocalizedText('dashboard.overview.account-type-content', {
              name: response.data.warehouse.name,
              type: accountType
            });
  
            this.isBusinessAccount = false;
            this.businessName = response.data.business.name;
  
            const flattenedData = flattenJson(response.data.warehouse);
            this.tableData = new MatTableDataSource<Warehouse>([flattenedData]);
          }
  
          this.loadingComponent.changeState(false, false);
        });
      }
    }
  }

  showNextIntegrationDialog() {
    const integrationResult = this.integrationService.popIntegrationData()
    if (integrationResult) {
      this.dialogService.openCustomDialog(
        IntegrationDialogs.find(item => item.name == integrationResult.name)?.dialog, {
          data: integrationResult.data
        }, () => {
          this.showNextIntegrationDialog();
        });
    }
  }

  hasAnyPermission(): boolean {
    console.log(this.userPermissions);
    return !!(this.userPermissions && (this.userPermissions.returnToWarehouse || this.userPermissions.returnToMainWarehouse));
  }
}
