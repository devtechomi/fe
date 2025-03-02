import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  imports: [
    MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent
  ],
  templateUrl: './warning-dialog.component.html',
  styleUrl: './warning-dialog.component.scss'
})
export class WarningDialogComponent {
  public title: string = '';
  public message: string = '';
  public noButtonText: string = '';
  public yesButtonText: string = '';
  
  constructor(private dialogRef: MatDialogRef<WarningDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.title = data.title;
    this.message = data.message;
    this.noButtonText = data.noButtonText;
    this.yesButtonText = data.yesButtonText;
  }

  onNoClicked() {
    if (this.data.config.onNoClicked) {
      this.data.config.onNoClicked();
    }

    this.dialogRef.close();
  }

  onYesClicked() {
    if (this.data.config.onYesClicked) {
      this.data.config.onYesClicked();
    }

    this.dialogRef.close();
  }
}
