import { Injectable, InjectionToken, inject, Renderer2, RendererFactory2, effect, DestroyRef, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Signal, signal, computed, linkedSignal } from '@angular/core';
export type ColorMode = 'light' | 'dark';

export const PREFERRED_COLOR_MODE = new InjectionToken<Signal<ColorMode>>(
  'PREFERRED_COLOR_MODE',
  {
    providedIn: 'root',
    factory: () => {
      const destroyRef = inject(DestroyRef);
      const platformId = inject(PLATFORM_ID);

      // Verifica si estamos en el navegador
      if (!isPlatformBrowser(platformId)) {
        return signal<ColorMode>('light'); // Valor predeterminado para entornos no navegador
      }

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const colorMode = signal<ColorMode>(
        mediaQuery.matches ? 'dark' : 'light',
      );

      const preferredColorModeChangeListener = (event: MediaQueryListEvent): void => {
        event.matches ? colorMode.set('dark') : colorMode.set('light');
      };

      mediaQuery.addEventListener('change', preferredColorModeChangeListener);

      destroyRef.onDestroy(() =>
        mediaQuery.removeEventListener('change', preferredColorModeChangeListener),
      );

      return colorMode;
    },
  },
);

// Renderer2 cannot be directly injected into singleton service
export const injectRenderer2 = (): Renderer2 =>
  inject(RendererFactory2).createRenderer(null, null);

@Injectable({
  providedIn: 'root'
})
export class LightDarkService {

  private readonly DARK_MODE_CLASS = 'dark-mode';

  private readonly _renderer = injectRenderer2();
  private readonly _document = inject(DOCUMENT);
  private readonly _preferredColorMode = inject(PREFERRED_COLOR_MODE);

  private readonly _mode = linkedSignal(() => this._preferredColorMode());
  readonly mode = this._mode.asReadonly();
  readonly isDarkMode = computed(() => this.mode() === 'dark');

  constructor() {
    const platformId = inject(PLATFORM_ID);

    // Solo ejecuta este código en el navegador
    if (isPlatformBrowser(platformId)) {
      const savedMode = localStorage.getItem('colorMode') as ColorMode | null;
      if (savedMode) {
        this._mode.set(savedMode);
      } else {
        effect(() => {
          this._applyDarkModeClass(this.isDarkMode());
        });
      }

      // Observa los cambios en el modo y actualiza localStorage
      effect(() => {
        const currentMode = this.mode();
        localStorage.setItem('colorMode', currentMode);
        this._applyDarkModeClass(this.isDarkMode());
      });
    }
  }

  toggleDarkMode(): void {
    this._mode.update((mode) => (mode === 'light' ? 'dark' : 'light'));
  }

  setDarkMode(enabled: boolean): void {
    this._mode.set(enabled ? 'dark' : 'light');
  }

  private _applyDarkModeClass(enabled: boolean): void {
    const htmlElement = this._document.documentElement;
    if (enabled) {
      this._renderer.addClass(htmlElement, this.DARK_MODE_CLASS);
    } else {
      this._renderer.removeClass(htmlElement, this.DARK_MODE_CLASS);
    }
  }
}