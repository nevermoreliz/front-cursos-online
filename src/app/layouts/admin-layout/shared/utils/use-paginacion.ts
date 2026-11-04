import { DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

/**
 * Configuración inicial opcional para `usePaginacion()`.
 * Permite personalizar los valores por defecto al llamar la función.
 */
export interface PaginacionConfig {
  /** Página inicial (default: 1) */
  page?: number;
  /** Registros por página (default: 10) */
  limit?: number;
  /** Texto de búsqueda inicial (default: '') */
  search?: string;
  /** Campo por el que ordenar (default: 'id') */
  sortBy?: string;
  /** Dirección del ordenamiento (default: 'DESC') */
  sortOrder?: 'ASC' | 'DESC';
  /** Milisegundos de debounce para la búsqueda (default: 400) */
  debounceMs?: number;
}

/**
 * Función utilitaria reutilizable que encapsula toda la lógica de
 * paginación + búsqueda con debounce.
 *
 * IMPORTANTE: Debe llamarse dentro del contexto de inyección de Angular
 * (constructor, campo de clase, o inject()).
 *
 * @example
 * // En cualquier componente con tabla paginada:
 * export class MiComponente {
 *   paginacion = usePaginacion({ limit: 25, sortBy: 'nombre' });
 *
 *   miResource = rxResource({
 *     params: () => this.paginacion.parametros(),
 *     stream: ({ params }) => this.miService.listar(params)
 *   });
 * }
 *
 * // En el HTML:
 * // <input matInput (input)="paginacion.onSearchInput($any($event.target).value)">
 * // <mat-paginator (page)="paginacion.cambiarPagina($event)" ...>
 */
export function usePaginacion(config?: PaginacionConfig) {

  // inject() funciona aquí porque se llama desde el contexto de inyección del componente
  const destroyRef = inject(DestroyRef);

  // ── Signal reactivo con los parámetros de paginación ──
  const parametros = signal({
    page: config?.page ?? 1,
    limit: config?.limit ?? 10,
    search: config?.search ?? '',
    sortBy: config?.sortBy ?? 'id',
    sortOrder: config?.sortOrder ?? 'DESC',
  });

  // ── Subject para el debounce de la búsqueda ──
  const searchSubject = new Subject<string>();
  const debounceMs = config?.debounceMs ?? 400;

  // Suscripción automática con cleanup
  searchSubject
    .pipe(
      debounceTime(debounceMs),
      distinctUntilChanged(),
      takeUntilDestroyed(destroyRef),
    )
    .subscribe(texto => {
      parametros.update(actual => ({
        ...actual,
        search: texto,
        page: 1, // Siempre regresar a la página 1 al buscar
      }));
    });

  return {
    /** Signal reactivo con los parámetros actuales (page, limit, search, sortBy, sortOrder) */
    parametros,

    /**
     * Manejar el evento `(page)` del MatPaginator.
     * Convierte pageIndex (base 0) a page (base 1) automáticamente.
     */
    cambiarPagina(event: PageEvent) {
      parametros.update(actual => ({
        ...actual,
        page: event.pageIndex + 1,
        limit: event.pageSize,
      }));
    },

    /**
     * Enviar texto de búsqueda al Subject con debounce.
     * Conectar con: `(input)="paginacion.onSearchInput($any($event.target).value)"`
     */
    onSearchInput(texto: string) {
      searchSubject.next(texto);
    },

    /**
     * Búsqueda inmediata (sin debounce). Útil para botones "Buscar".
     */
    buscarInmediato(texto: string) {
      parametros.update(actual => ({
        ...actual,
        search: texto,
        page: 1,
      }));
    },

    /**
     * Resetear todos los parámetros a sus valores iniciales.
     */
    resetear() {
      parametros.set({
        page: config?.page ?? 1,
        limit: config?.limit ?? 10,
        search: config?.search ?? '',
        sortBy: config?.sortBy ?? 'id',
        sortOrder: config?.sortOrder ?? 'DESC',
      });
    },
  };
}

