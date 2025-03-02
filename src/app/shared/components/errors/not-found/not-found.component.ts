import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { sidenavRoutes } from '../../../../features/sidenav.routes';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    CommonModule,
    TranslateModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {
  private readonly fullPageBackgroundColor: string = 'radial-gradient(circle at 0% 5%, #D0CF3D -50%, #639B5C, #136049)';
  private readonly sidenavBackgroundColor: string = 'transparent';

  public isSidenavPresent: boolean = false;

  constructor(private router: Router,
              private elementRef: ElementRef,
              private renderer: Renderer2) {
    this.isSidenavPresent = false;
    for (const item of sidenavRoutes) {
      if (this.router.url.startsWith('/' + item.path!)) {
        this.isSidenavPresent = true;
        break;
      }
    }
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', '100%');
    this.renderer.setStyle(this.elementRef.nativeElement, 'background',
      this.isSidenavPresent ? this.sidenavBackgroundColor : this.fullPageBackgroundColor);
  }

  return() {
    if (this.isSidenavPresent) {
      this.router.navigate(['/dashboard/overview']);
    }
    else {
      this.router.navigate(['/']);
    }
  }
}
