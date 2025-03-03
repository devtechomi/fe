import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Box } from '../../../../core/contracts/box';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccountService } from '../../../services/account.service';
import { ApiResponse } from '../../../../core/models/api-response';
import { ToasterNotificationService } from '../../../../shared/services/notifications/toaster-notification.service';
import { ToasterType } from '../../../../shared/models/notifications/toaster-type';
import { TokenService } from '../../../../core/auth/services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boxes',
  imports: [
    MatTableModule,
    MatInputModule, MatButtonModule, MatIconModule, FormsModule,
    MatPaginatorModule,
    TranslateModule,
    LoadingComponent,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './boxes.component.html',
  styleUrl: './boxes.component.scss'
})
export class BoxesComponent implements OnInit {
  private readonly firstPage: number = 1;
  private readonly defaultPageSize: number = 20;

  @ViewChild(LoadingComponent) loadingComponent!: LoadingComponent;
  @ViewChild(MatPaginatorModule) paginator!: MatPaginatorModule;
  
  public searchText: string = '';

  public columnNames: string[] = [
    'code',
    'name',
    'description',
    'type', 
    'volume', 
    'volume-empty'
  ]
  public tableData: MatTableDataSource<Box> = new MatTableDataSource<Box>();

  public count: number = 0;
  private currentPage: number = this.firstPage;
  private pageSize: number = this.defaultPageSize;
  public isSuser: boolean = false;

  constructor(private accountService: AccountService,
              private tokenService: TokenService,
              private toasterNotificationService: ToasterNotificationService) {
  }

  ngOnInit(): void {
    const accountType = localStorage.getItem('accountType');
    this.isSuser = accountType === 'SuperUser' ? true : false;
    console.log(this.isSuser);
    if (!this.isSuser) {
      if (!this.tokenService.isAuthenticated.value)
        return;
  
      this.accountService.getBoxes(this.firstPage, this.defaultPageSize).then((response) => {
        this.fillTable(response);
        this.loadingComponent.changeState(false, false);
      });
    }
  }

  fillTable(response: Partial<ApiResponse>) {
    this.tableData = new MatTableDataSource<Box>(response.data);
    this.count = response.metadata.count;
  }

  async onSearchClicked() {
    this.loadingComponent.changeState(true, false);
    
    this.currentPage = this.firstPage;
    const response = await this.accountService.getBoxes(this.firstPage, this.pageSize, this.searchText);
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
    const response = await this.accountService.getBoxes(this.currentPage, this.pageSize, this.searchText);
    this.fillTable(response);

    this.loadingComponent.changeState(false, false);
  }

  async onSyncClicked() {
    this.loadingComponent.changeState(true, false);

    const syncResponse = await this.accountService.syncBoxes();
    if (syncResponse.isSuccess) {
      if (syncResponse.data.numberofChanges != 0) {
        this.currentPage = this.firstPage;
        const boxesResponse = await this.accountService.getBoxes(this.currentPage, this.pageSize, this.searchText);
        this.fillTable(boxesResponse);

        this.toasterNotificationService.showToaster({
          type: ToasterType.Success,
          messageKey: 'warehouse-operations.boxes.success'
        });
      }
      else {
        this.toasterNotificationService.showToaster({
          type: ToasterType.Success,
          messageKey: 'warehouse-operations.boxes.up-to-date'
        });
      }
    }
    
    this.loadingComponent.changeState(false, false);
  }
}
