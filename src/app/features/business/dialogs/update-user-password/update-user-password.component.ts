import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '../../../../shared/services/dialog.service';

@Component({
  selector: 'app-update-user-password',
  imports: [
    CommonModule,
    MatButtonModule, MatDialogActions, MatDialogTitle, MatDialogContent,
    TranslateModule,
    MatFormFieldModule, ReactiveFormsModule, MatIconModule, MatInputModule
  ],
  templateUrl: './update-user-password.component.html',
  styleUrl: './update-user-password.component.scss'
})
export class UpdateUserPasswordComponent {
  public updatePasswordForm: FormGroup;
  public hidePassword: boolean = true;

  constructor(private dialogRef: MatDialogRef<UpdateUserPasswordComponent>,
              @Inject(MAT_DIALOG_DATA) private data: any,
              private formBuilder: FormBuilder,
              private dialogService: DialogService) {
    this.updatePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onPasswordToggle() {
    this.hidePassword = !this.hidePassword;
  }

  async onButtonClicked() {
    if (this.updatePasswordForm.invalid)
      return;

    const dialogRef = await this.dialogService.openQuestionDialog({
      titleKey: 'business.warehouses.update-password.confirm-header',
      messageKey: 'business.warehouses.update-password.confirm-message',
      noButtonTextKey: 'actions.no',
      yesButtonTextKey: 'actions.yes',
      onYesClicked: () => {
        this.dialogRef.close(this.form['password']?.value);
      }
    });
  }

  get form() {
    return this.updatePasswordForm.controls;
  }
}
