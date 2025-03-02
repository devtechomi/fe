import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { QuestionDialogConfig } from '../models/dialogs/question-dialog-config';
import { QuestionDialogComponent } from '../components/dialogs/question-dialog/question-dialog.component';
import { InfoDialogComponent } from '../components/dialogs/info-dialog/info-dialog.component';
import { InfoDialogConfig } from '../models/dialogs/info-dialog-config';
import { LocalizationService } from '../../core/services/localization.service';
import { WarningDialogComponent } from '../components/dialogs/warning-dialog/warning-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog,
              private localizationService: LocalizationService) {
  }

  async openQuestionDialog(config: Partial<QuestionDialogConfig>): Promise<MatDialogRef<any>> {
    const title = await this.localizationService.getLocalizedText(config.titleKey!, config.titleParameters);
    const message = await this.localizationService.getLocalizedText(config.messageKey!, config.messageParameters);
    const noButtonText = await this.localizationService.getLocalizedText(config.noButtonTextKey!);
    const yesButtonText = await this.localizationService.getLocalizedText(config.yesButtonTextKey!);

    const dialog = this.dialog.open(QuestionDialogComponent, {
      data: {
        title,
        message,
        noButtonText,
        yesButtonText,
        config
      }
    });

    dialog.afterClosed().subscribe(data => {
      if (config.onClosed) {
        config.onClosed(data);
      }
    });

    return dialog;
  }

  async openWarningDialog(config: Partial<QuestionDialogConfig>): Promise<MatDialogRef<any>> {
    const title = await this.localizationService.getLocalizedText(config.titleKey!, config.titleParameters);
    const message = await this.localizationService.getLocalizedText(config.messageKey!, config.messageParameters);
    const noButtonText = await this.localizationService.getLocalizedText(config.noButtonTextKey!);
    const yesButtonText = await this.localizationService.getLocalizedText(config.yesButtonTextKey!);

    const dialog = this.dialog.open(WarningDialogComponent, {
      data: {
        title,
        message,
        noButtonText,
        yesButtonText,
        config
      }
    });

    dialog.afterClosed().subscribe(data => {
      if (config.onClosed) {
        config.onClosed(data);
      }
    });

    return dialog;
  }

  async openInfoDialog(config: Partial<InfoDialogConfig>): Promise<MatDialogRef<any>> {
    const title = await this.localizationService.getLocalizedText(config.titleKey!, config.titleParameters);
    const message = await this.localizationService.getLocalizedText(config.messageKey!, config.messageParameters);
    const buttonText = await this.localizationService.getLocalizedText(config.buttonTextKey!);

    const dialog = this.dialog.open(InfoDialogComponent, {
      data: {
        title,
        message,
        buttonText,
        config
      }
    });

    dialog.afterClosed().subscribe(data => {
      if (config.onClosed) {
        config.onClosed(data);
      }
    });

    return dialog;
  }

  openCustomDialog(component: any, config?: MatDialogConfig<any> | undefined, afterClosed?: (data?: any) => void): MatDialogRef<any> {
    const dialog = this.dialog.open(component, config);

    dialog.afterClosed().subscribe(data => {
      if (afterClosed) {
        afterClosed(data);
      }
    });

    return dialog;
  }
}
