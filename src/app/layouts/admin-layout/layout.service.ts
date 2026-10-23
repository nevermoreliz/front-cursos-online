import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isSidebarOpen = signal(false);
  isCollapsed = signal(
    typeof window !== 'undefined' ? localStorage.getItem('sidebar_collapsed') === 'true' : false
  );

  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }

  toggleCollapsed() {
    this.isCollapsed.update(val => {
      const next = !val;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebar_collapsed', String(next));
      }
      return next;
    });
  }
}
