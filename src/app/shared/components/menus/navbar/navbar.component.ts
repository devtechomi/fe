import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LocalizationService } from '../../../../core/services/localization.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Localization } from '../../../../core/models/localization';


@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    TranslateModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatSlideToggleModule,
    MatInputModule, MatSelectModule, MatFormFieldModule, MatCheckboxModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, AfterViewInit {
  public username: string = "";
  public showUsername: boolean = false;
  @ViewChild('languageSelector') languageSelector: MatSelect | null = null;
  languageOptions: Localization[] = [];

  @ViewChild('themeToggler') themeToggler: MatSlideToggle | null = null;

  constructor(private localizationService: LocalizationService,
              private themeService: ThemeService) {
    localizationService.initializeLanguage();
    themeService.initializeTheme();
  }

  ngOnInit(): void {
    // To show the supported languages in the select menu of the navbar.
    this.languageOptions = this.localizationService.supportedLanguages;
  }

  ngAfterViewInit(): void {
    if (this.themeToggler != null) {
      this.themeToggler.checked = this.themeService.isDarkTheme();
    }

    if (this.languageSelector != null) {
      this.languageSelector.value = this.localizationService.getCurrentLanguageCode();
    }
  }
  
  onSwitchedTheme(event: any): void {
    this.themeService.switchTheme(event.checked ? 'dark-theme' : 'light-theme');
  }

  onSwitchedLanguage(event: any): void {
    this.localizationService.switchLanguage(event.value);
  }
}
