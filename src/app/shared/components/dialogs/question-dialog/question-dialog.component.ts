import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogTitle, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-question-dialog',
  imports: [
    MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent
  ],
  templateUrl: './question-dialog.component.html',
  styleUrl: './question-dialog.component.scss'
})
export class QuestionDialogComponent {
  public title: string = '';
  public message: string = '';
  public noButtonText: string = '';
  public yesButtonText: string = '';

  constructor(private dialogRef: MatDialogRef<QuestionDialogComponent>,
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
