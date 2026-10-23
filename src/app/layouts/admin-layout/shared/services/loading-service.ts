import { Service, signal, inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

/**
 * Servicio reactivo para gestionar el estado de carga del Dashboard.
 * Permite control tanto automático (escuchando el Router) como manual.
 */
@Service()
export class LoadingService {
  private router = inject(Router);
  private _isLoading = signal<boolean>(false);

  /** Signal de sólo lectura para que los componentes consuman el estado */
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    // ── Modo Automático: Detecta cambios de ruta en el Dashboard ──
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this._isLoading.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this._isLoading.set(false);
      }
    });
  }

  /** Activa el spinner manualmente */
  show(): void {
    this._isLoading.set(true);
  }

  /** Desactiva el spinner manualmente */
  hide(): void {
    this._isLoading.set(false);
  }
}
