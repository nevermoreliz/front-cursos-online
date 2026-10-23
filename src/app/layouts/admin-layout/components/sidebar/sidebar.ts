import { Component, inject, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { LayoutService } from '../../layout.service';
import { AuthService } from '../../../../core/services/auth-service';
import { MenuItem } from '../../../../core/interfaces/menu.interface';
import { MenuService } from '../../../../core/services/menu-service';

// ──────────────────────────────────────────────────────────────
// Sidebar: Componente de presentación del menú lateral.
//
// Responsabilidades:
//   • Renderizar los ítems del menú (headings, links, submenús)
//   • Gestionar el estado de expansión de submenús
//   • Marcar el ítem activo según la ruta actual
//   • Reaccionar a cambios de navegación y de usuario
//
// NO es responsable de:
//   • Definir qué ítems existen (eso lo hace MenuService)
//   • Filtrar por roles (eso lo hace MenuService)
// ──────────────────────────────────────────────────────────────
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
})
export class Sidebar implements OnInit, OnDestroy {

  // ─── Servicios inyectados ───
  layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private menuService = inject(MenuService);
  private router = inject(Router);

  // ─── Estado ───
  currentUser = this.authService.currentUser;

  /** Estado de hover cuando el sidebar está colapsado en desktop */
  isHovered = signal(false);

  /**
   * Indica si visualmente se debe renderizar en modo colapsado (solo iconos).
   * Solo es true si el sidebar está colapsado Y el usuario no tiene el cursor encima (hover).
   * Al pasar el cursor, se expande completo temporalmente.
   */
  isVisualmenteColapsado = computed(() => {
    return this.layoutService.isCollapsed() && !this.isHovered();
  });

  /**
   * Menú calculado reactivamente a partir del rol del usuario.
   * Se recalcula automáticamente cuando cambia el usuario (login/logout).
   */
  menuItems = computed(() => {
    const user = this.currentUser();
    const items = this.menuService.obtenerMenu(user?.rol);
    // Marcar activos según la ruta actual
    this.marcarActivos(items, this.router.url);
    return items;
  });

  private routerSub!: Subscription;

  ngOnInit(): void {
    // Escuchar cambios de ruta para actualizar el estado activo y resetear hover
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.marcarActivos(this.menuItems(), this.router.url);
        this.isHovered.set(false);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  // ════════════════════════════════════════════════════════════
  //  MÉTODOS PÚBLICOS (usados desde el template)
  // ════════════════════════════════════════════════════════════

  onMouseEnter(): void {
    if (this.layoutService.isCollapsed()) {
      this.isHovered.set(true);
    }
  }

  onMouseLeave(): void {
    if (this.layoutService.isCollapsed()) {
      this.isHovered.set(false);
    }
  }

  /**
   * Alterna la expansión de un submenú.
   * Si el sidebar estaba en modo mini, se expande al interactuar.
   */
  toggleSubmenu(item: MenuItem): void {
    if (!item.submenu) return;
    if (this.layoutService.isCollapsed() && !this.isHovered()) {
      this.isHovered.set(true);
      item.expanded = true;
      return;
    }
    item.expanded = !item.expanded;
  }

  /**
   * Determina si un svgIcon es un path simple (no un SVG completo).
   * Usado en el template para decidir qué tipo de icono renderizar.
   */
  esPathSimple(svgIcon: string | undefined): boolean {
    if (!svgIcon) return false;
    return !this.menuService.esSvgCompleto(svgIcon);
  }

  /**
   * TrackBy para ngFor — mejora el rendimiento evitando
   * re-renderizar ítems que no cambiaron.
   */
  trackByTitle(_index: number, item: MenuItem): string {
    return item.title;
  }

  /**
   * Verifica si un ítem o alguno de sus hijos está activo
   * (su ruta coincide con la URL actual).
   */
  esItemActivo(item: MenuItem): boolean {
    if (item.route) {
      if (item.route === '/dashboard' || item.route === '/admin/home') {
        return this.router.url === item.route;
      }
      return this.router.url.startsWith(item.route);
    }
    if (item.submenu) {
      return item.submenu.some(sub => this.esItemActivo(sub));
    }
    return false;
  }

  // ════════════════════════════════════════════════════════════
  //  MÉTODOS PRIVADOS
  // ════════════════════════════════════════════════════════════

  /**
   * Recursivamente marca ítems activos y expande submenús padres.
   * Retorna true si algún hijo está activo (para expandir el padre).
   */
  private marcarActivos(items: MenuItem[], urlActual: string): boolean {
    let algunoActivo = false;

    items.forEach(item => {
      // ¿Este ítem tiene la ruta activa?
      if (item.route) {
        if (item.route === '/dashboard' || item.route === '/admin/home') {
          item.active = urlActual === item.route;
        } else {
          item.active = urlActual.startsWith(item.route);
        }
      } else {
        item.active = false;
      }

      // ¿Algún hijo está activo?
      if (item.submenu) {
        const hijoActivo = this.marcarActivos(item.submenu, urlActual);
        if (hijoActivo) {
          item.expanded = true; // Auto-expandir si un hijo está activo
          item.active = true;
        }
      }

      if (item.active) algunoActivo = true;
    });

    return algunoActivo;
  }
}

