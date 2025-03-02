import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: string | null = null;

  private readonly defaultTheme = 'light-theme';
  readonly themes: string[] = [
    'light-theme',
    'dark-theme'
  ];

  initializeTheme(): void {
    let theme = localStorage.getItem('theme');
    if (theme == null || !this.themes.some(t => t == theme)) {
      theme = this.defaultTheme;
    }

    this.updateTheme(theme);
  }

  switchTheme(theme: string): void {
    let selectedTheme = this.themes.find(t => t == theme);
    if (selectedTheme == undefined)
      return;

    this.updateTheme(theme);
    localStorage.setItem('theme', theme);
  }

  private updateTheme(theme: string): void {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove(this.currentTheme!);
    htmlElement.classList.add(theme);
    this.currentTheme = theme;
  }

  isDarkTheme(): boolean {
    return this.currentTheme == 'dark-theme';
  }
}
