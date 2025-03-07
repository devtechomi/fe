import { Injectable } from '@angular/core';
import { Localization } from '../models/localization';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {
  currentLanguage: Localization | undefined = undefined;
  
  private readonly defaultLanguageCode: string = 'tr';
  readonly supportedLanguages: Localization[] = [
    { code: 'tr', displayName: 'Türkçe', iconPath: '../assets/flags/tr.svg' },
    { code: 'en', displayName: 'English', iconPath: '../assets/flags/en.svg' }
  ];

  constructor(private translateService: TranslateService) {
  }

  initializeLanguage(): void {
    this.translateService.addLangs(this.supportedLanguages.map(lang => lang.code));
    this.translateService.setDefaultLang(this.defaultLanguageCode);
  
    let langCode: string | null = localStorage.getItem('language');
  
    if (!langCode) {
      if (!langCode || !this.supportedLanguages.some(l => l.code === langCode)) {
        langCode = this.defaultLanguageCode;
      }
    }
  
    this.currentLanguage = this.supportedLanguages.find(l => l.code === langCode);
    this.translateService.use(this.currentLanguage!.code);
    localStorage.setItem('language', this.currentLanguage!.code);
  }
  

  switchLanguage(langCode: string | undefined): void {
    if (langCode == undefined)
      return;
    
    const selectedLanguage = this.supportedLanguages.find(l => l.code == langCode);
    if (selectedLanguage == undefined)
      return;

    this.currentLanguage = selectedLanguage;
    this.translateService.use(selectedLanguage.code);
    localStorage.setItem('language', selectedLanguage.code);
  }

  getCurrentLanguageCode(): string | undefined {
    return this.currentLanguage?.code;
  }

  async getLocalizedText(key: string, params?: any): Promise<string> {
    if (params) {
      return await firstValueFrom(this.translateService.get(key, params));
    }

    return await firstValueFrom(this.translateService.get(key));
  }

  getLocalizedTextInstant(key: string, params?: any): string {
    if (params) {
      return this.translateService.instant(key, params);
    }

    return this.translateService.instant(key);
  }
}
