import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/menus/navbar/navbar.component";
import { SidenavComponent } from './shared/components/menus/sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { sidenavRoutes } from './features/sidenav.routes';
import { TokenService } from './core/auth/services/token.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    NavbarComponent,
    SidenavComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  public isAuthenticated: boolean = false;
  public isSidenavPresent: boolean = false;
  
  constructor(private tokenService: TokenService,
              private router: Router) {
    this.tokenService.isAuthenticated.subscribe((value) => {
      this.isAuthenticated = value;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        for (const item of sidenavRoutes) {
          if (event.url.startsWith('/' + item.path!)) {
            this.isSidenavPresent = true;
            return;
          }
        }

        this.isSidenavPresent = false;
      }
    });
  }
}
