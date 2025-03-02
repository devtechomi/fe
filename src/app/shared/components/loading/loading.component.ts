import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  public isLoading: boolean = true;
  public hideBackground: boolean = true;

  changeState(isLoading: boolean, hideBackground: boolean) {
    this.isLoading = isLoading;
    this.hideBackground = hideBackground;
  }
}
