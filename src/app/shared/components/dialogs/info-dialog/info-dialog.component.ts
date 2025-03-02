import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  imports: [
    MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {
  public title: string = '';
  public message: string = '';
  public buttonText: string = '';

  constructor(private dialogRef: MatDialogRef<InfoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.title = data.title;
    this.message = data.message;
    this.buttonText = data.buttonText;
  }

  onButtonClicked() {
    if (this.data.config.onButtonClicked) {
      this.data.config.onButtonClicked();
    }

    this.dialogRef.close();
  }
}
