import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-snackbar',
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule, MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss'
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              private snackbarRef: MatSnackBarRef<SnackbarComponent>) {
  }

  onClose() {
    if (this.data.buttonAction) {
      this.data.buttonAction();
    }
    
    this.snackbarRef.dismiss();
  }
}
