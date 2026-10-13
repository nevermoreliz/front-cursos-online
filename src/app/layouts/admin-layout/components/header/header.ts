import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../layout.service';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  layoutService = inject(LayoutService);
  authService = inject(AuthService)
  private router = inject(Router);
  isProfileOpen = signal(false);

  currentUser = this.authService.currentUser;

  constructor() {
    // Close dropdown on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isProfileOpen.set(false);
      });
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  toggleProfile() {
    this.isProfileOpen.update(val => !val);
  }

  closeProfile() {
    this.isProfileOpen.set(false);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const profileArea = target.closest('.profile-dropdown-area');
    if (!profileArea) {
      this.isProfileOpen.set(false);
    }
  }
}
