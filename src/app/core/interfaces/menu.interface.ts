import { SafeHtml } from '@angular/platform-browser';

// ──────────────────────────────────────────────────────────────
// MenuItem: Define la estructura de cada elemento del menú.
//
// Soporta 3 tipos de elementos:
//   1. HEADING  → Título de sección (heading: true)
//   2. LINK     → Elemento navegable con ruta
//   3. PARENT   → Elemento con submenú desplegable (submenu[])
//
// Los iconos pueden ser:
//   • Un path SVG simple (string con "M..." para <path d="">)
//   • SVG completo en crudo (string con "<svg...>")
//     → Se sanitiza automáticamente vía DomSanitizer
// ──────────────────────────────────────────────────────────────

/** Roles disponibles en el sistema */
export type RolUsuario = 'SUPERADMIN' | 'ADMIN' | 'OPERADOR';

/** Estructura de un elemento del menú lateral */
export interface MenuItem {

  /** Texto visible del elemento */
  title: string;

  /**
   * Icono SVG. Acepta dos formatos:
   *  - Path SVG simple: "M3 12l2-2m0 0l7-7..."
   *  - SVG completo: "<svg xmlns='...'> ... </svg>"
   */
  svgIcon?: string;

  /** SVG sanitizado listo para [innerHTML] (se genera automáticamente) */
  svgSanitizado?: SafeHtml;

  /** Tooltip al hacer hover (se usa también cuando el sidebar está colapsado) */
  tooltip?: string;

  /** Ruta de navegación (ej: '/admin/usuarios') */
  route?: string;

  /**
   * ¿Es un encabezado de sección?
   * Si es true, solo se muestra como título separador.
   */
  heading?: boolean;

  /**
   * Roles que pueden ver este elemento.
   * Si no se define, el elemento es visible para todos.
   */
  roles?: RolUsuario[];

  /** Submenús anidados (soporta múltiples niveles) */
  submenu?: MenuItem[];

  /** Badge numérico o texto (ej: "Nuevo", 5) */
  badge?: string | number;

  // ─── Estado interno (NO definir manualmente) ───

  /** ¿El submenú está expandido? (gestionado por el componente) */
  expanded?: boolean;

  /** ¿Este item o algún hijo está activo? (gestionado por el componente) */
  active?: boolean;
}
