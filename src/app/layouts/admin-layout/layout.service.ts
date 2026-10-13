import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isSidebarOpen = signal(false);
  isCollapsed = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }

  toggleCollapsed() {
    this.isCollapsed.update(val => !val);
  }
}
