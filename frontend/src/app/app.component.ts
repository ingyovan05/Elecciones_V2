import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './core/services/auth.service';
import { InactivityService } from './core/services/inactivity.service';
import { ThemeService } from './core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Portal Elecciones';
  readonly theme$ = this.themeService.theme$;
  private sub?: Subscription;

  constructor(
    public auth: AuthService,
    private inactivity: InactivityService,
    private themeService: ThemeService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.sub = this.auth.currentUser$.subscribe((user) => {
      if (user) {
        this.inactivity.start();
      } else {
        this.inactivity.stop();
      }
    });
  }

  ngOnDestroy() {
    this.inactivity.stop();
    this.sub?.unsubscribe();
  }

  logout() {
    this.auth.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToPanel() {
    this.router.navigate(['/panel']);
  }
}
