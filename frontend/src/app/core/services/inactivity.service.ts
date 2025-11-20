
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class InactivityService implements OnDestroy {
  private timeoutId?: number;
  private readonly limit = 60 * 1000; // 1 minute of inactivity
  private listeners: Array<() => void> = [];

  constructor(private zone: NgZone, private auth: AuthService) {
    this.zone.runOutsideAngular(() => {
      const windowEvents = [
        'click',
        'keydown',
        'mousemove',
        'mousedown',
        'touchstart',
        'touchmove',
        'pointerdown',
        'pointermove',
        'wheel',
        'scroll',
      ];

      windowEvents.forEach((event) => {
        const handler = () => this.resetTimer();
        window.addEventListener(event, handler, { passive: true });
        this.listeners.push(() => window.removeEventListener(event, handler));
      });

      const visibilityHandler = () => {
        if (document.visibilityState === 'visible') {
          this.resetTimer();
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);
      this.listeners.push(() => document.removeEventListener('visibilitychange', visibilityHandler));
    });
  }

  start() {
    this.resetTimer();
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  private resetTimer() {
    if (!this.auth.token) return;
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.zone.run(() => this.auth.logout('Sesión cerrada por inactividad'));
    }, this.limit);
  }

  ngOnDestroy() {
    this.listeners.forEach((remove) => remove());
    this.stop();
  }
}
