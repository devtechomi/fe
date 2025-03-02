import { AfterViewInit, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatAccordion, MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider'; 
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../features/services/auth.service';
import { sidenavElements } from '../../../../features/sidenav-elements';
import { TokenService } from '../../../../core/auth/services/token.service';
import { RoleService } from '../../../../core/auth/services/role.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { waitFor } from '../../../utility/time.util';
import { LoadingComponent } from '../../loading/loading.component';

@Component({
  selector: 'app-sidenav',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    TranslateModule,
    MatSidenavModule, MatButtonModule,
    MatAccordion, MatExpansionModule, MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements AfterViewInit {
  @ViewChild(RouterOutlet, { static: true }) outlet!: RouterOutlet;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  
  public drawerOpened: boolean = true;
  public sidenavElements = sidenavElements;

  public isLoggingOut: boolean = false;

  constructor(private tokenService: TokenService,
              private authService: AuthService,
              private router: Router,
              private roleService: RoleService) {
    this.tokenService.isAuthenticated.subscribe((value) => {
      this.drawerOpened = true;
    });
  }

  ngAfterViewInit(): void {

  }

  public canSeeMenu(roles: string[] | null) {
    return !roles || roles.find(value => value == this.roleService.getAccountType());
  }

  onNavigate() {
    const activeComponent = this.outlet.component;
    if (activeComponent && 'loadingComponent' in activeComponent) {
      (activeComponent.loadingComponent as LoadingComponent).changeState(true, false);
    }
  }

  async onLogOut() {
    this.isLoggingOut = true;

    await this.authService.logout();
    this.router.navigate(['/login']);

    this.isLoggingOut = false;
  }
}
