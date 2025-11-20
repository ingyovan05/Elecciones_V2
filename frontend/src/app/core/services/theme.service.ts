import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'elecciones-theme';
  private readonly body = document.body;
  private readonly themeSubject = new BehaviorSubject<ThemeMode>(this.getStoredTheme());

  readonly theme$ = this.themeSubject.asObservable();

  constructor(private overlay: OverlayContainer) {
    this.applyTheme(this.themeSubject.value);
  }

  toggleTheme() {
    const next = this.themeSubject.value === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(theme: ThemeMode) {
    if (this.themeSubject.value === theme) {
      return;
    }
    this.themeSubject.next(theme);
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode) {
    this.body.classList.remove('light-theme', 'dark-theme');
    this.body.classList.add(`${theme}-theme`);
    document.documentElement.classList.toggle('dark', theme === 'dark');

    const overlayContainerClasses = this.overlay.getContainerElement().classList;
    overlayContainerClasses.remove('light-theme', 'dark-theme');
    overlayContainerClasses.add(`${theme}-theme`);
  }

  private getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(this.storageKey) as ThemeMode | null;
    return stored ?? 'dark';
  }
}
