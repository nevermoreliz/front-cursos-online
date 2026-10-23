import { inject, Injectable, Service } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem, RolUsuario } from '../interfaces/menu.interface';

// ──────────────────────────────────────────────────────────────
// MenuService: Centraliza la configuración del menú lateral.
//
// ¿Por qué un servicio separado?
//   → Separar la DEFINICIÓN del menú de su PRESENTACIÓN.
//     El Sidebar solo se encarga de renderizar, no de saber
//     qué elementos existen. Esto facilita:
//     • Cambiar el menú sin tocar el componente
//     • Testear la lógica de filtrado por roles
//     • Reutilizar el menú en otros layouts si es necesario
// ──────────────────────────────────────────────────────────────
@Service()
export class MenuService {

  private sanitizer = inject(DomSanitizer);

  // ════════════════════════════════════════════════════════════
  //  DEFINICIÓN DEL MENÚ
  //  ──────────────────
  //  Para agregar un nuevo ítem, solo agrega un objeto aquí.
  //  Los tipos de ítems soportados son:
  //
  //  HEADING (título de sección):
  //    { title: 'Mi Sección', heading: true, roles: [...] }
  //
  //  LINK (navegación directa):
  //    { title: 'Página', svgIcon: '...', route: '/ruta', roles: [...] }
  //
  //  PARENT con SUBMENÚ:
  //    { title: 'Padre', svgIcon: '...', roles: [...], submenu: [
  //        { title: 'Hijo 1', route: '/ruta1' },
  //        { title: 'Hijo 2', route: '/ruta2' },
  //    ]}
  // ════════════════════════════════════════════════════════════
  private readonly menuDefinicion: MenuItem[] = [

    // ─── Dashboard (todos los roles) ───
    {
      title: 'Dashboard',
      svgIcon: 'M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z',
      tooltip: 'Ir al Dashboard',
      route: '/dashboard',
      roles: ['SUPERADMIN', 'ADMIN', 'OPERADOR']
    },

    // ─── Sección: Administración (SUPERADMIN y ADMIN) ───
    {
      title: 'Administración',
      heading: true,
      roles: ['SUPERADMIN', 'ADMIN']
    },
    {
      title: 'Gestión de Usuarios',
      svgIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1em" viewBox="0 0 640 512">
          <path fill="currentColor" d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64m448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64m32 32h-64c-17.6 0-33.5 7.1-45.1 18.6c40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64m-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32S208 82.1 208 144s50.1 112 112 112m76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2m-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4" />
        </svg>`,
      tooltip: 'Gestión de Usuarios',
      route: '/admin/usuarios-listar',
      roles: ['SUPERADMIN', 'ADMIN']
    },
    {
      title: 'Roles',
      svgIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
          <path fill="currentColor" d="M19.307 3.21a2.91 2.91 0 1 0-.223 1.94a11.64 11.64 0 0 1 8.232 7.049l1.775-.698a13.58 13.58 0 0 0-9.784-8.291m-2.822 1.638a.97.97 0 1 1 0-1.939a.97.97 0 0 1 0 1.94m-4.267.805l-.717-1.774a13.58 13.58 0 0 0-8.291 9.784a2.91 2.91 0 1 0 1.94.223a11.64 11.64 0 0 1 7.068-8.233m-8.34 11.802a.97.97 0 1 1 0-1.94a.97.97 0 0 1 0 1.94m12.607 8.727a2.91 2.91 0 0 0-2.599 1.62a11.64 11.64 0 0 1-8.233-7.05l-1.774.717a13.58 13.58 0 0 0 9.813 8.291a2.91 2.91 0 1 0 2.793-3.578m0 3.879a.97.97 0 1 1 0-1.94a.97.97 0 0 1 0 1.94M32 16.485a2.91 2.91 0 1 0-4.199 2.599a11.64 11.64 0 0 1-7.05 8.232l.718 1.775a13.58 13.58 0 0 0 8.291-9.813A2.91 2.91 0 0 0 32 16.485m-2.91.97a.97.97 0 1 1 0-1.94a.97.97 0 0 1 0 1.94" />
          <path fill="currentColor" d="M19.19 16.35a3.879 3.879 0 1 0-5.42 0a4.85 4.85 0 0 0-2.134 4.014v1.939h9.697v-1.94a4.85 4.85 0 0 0-2.143-4.014m-4.645-2.774a1.94 1.94 0 1 1 3.88 0a1.94 1.94 0 0 1-3.88 0m-.97 6.788a2.91 2.91 0 1 1 5.819 0z" />
        </svg>`,
      tooltip: 'Configuración de Roles',
      route: '/admin/roles',
      roles: ['SUPERADMIN']
    },
    {
      title: 'Config. Whatsapp',
      svgIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M40.47 14.14v-3.21H10.75a3.23 3.23 0 0 0-3.22 3.21h0v18H4v4.94h23.51v-4.95H10.75v-18Z" />
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M32.14 17.36A1.61 1.61 0 0 0 30.53 19v16.5a1.61 1.61 0 0 0 1.61 1.6h10.25A1.61 1.61 0 0 0 44 35.49V19a1.61 1.61 0 0 0-1.61-1.61h0Zm8.64 14.77h-7V20.58h7Z" />
        </svg>`,
      tooltip: 'Configuración de Whatsapp',
      route: '/admin/config-whatsapp',
      roles: ['SUPERADMIN']
    },

    // ─── Sección: Gestión (todos los roles) ───
    {
      title: 'Gestión',
      heading: true,
      roles: ['SUPERADMIN', 'ADMIN', 'OPERADOR']
    },
    {
      title: 'Cursos',
      svgIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="M20 15c0 1.864 0 2.796-.304 3.53a4 4 0 0 1-2.165 2.165C16.796 21 15.864 21 14 21h-3c-3.772 0-5.658 0-6.83-1.172C3 18.657 3 16.771 3 13V7a4 4 0 0 1 4-4" />
            <path d="m10 8.5l.434 3.969a.94.94 0 0 0 .552.753c.686.295 1.971.778 3.014.778s2.328-.483 3.014-.778a.94.94 0 0 0 .553-.753L18 8.5m2.5-1v3.77M14 4L7 7l7 3l7-3z" />
          </g>
        </svg>`,
      tooltip: 'Gestión de Cursos',
      route: '/admin/cursos',
      roles: ['SUPERADMIN', 'ADMIN', 'OPERADOR']
    },
    {
      title: 'Planificación',
      svgIcon: 'M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z',
      tooltip: 'Planificación de Proyectos',
      route: '/admin/project-planning',
      roles: ['SUPERADMIN', 'ADMIN']
    },

    // ─── Sección: Perfil (todos los roles) ───
    {
      title: 'Mi Cuenta',
      heading: true,
      roles: ['SUPERADMIN', 'ADMIN', 'OPERADOR']
    },
    {
      title: 'Configuración',
      svgIcon: 'M10 2a3.5 3.5 0 0 0-3.5 3.5V7A3 3 0 0 0 3.5 10v7A3 3 0 0 0 6.5 20h7a3 3 0 0 0 3-3v-7A3 3 0 0 0 13.5 7v-1.5A3.5 3.5 0 0 0 10 2Zm1 5V5.5a1.5 1.5 0 1 0-3 0V7h3Z',
      tooltip: 'Configuración de Perfil',
      roles: ['SUPERADMIN', 'ADMIN', 'OPERADOR'],
      submenu: [
        {
          title: 'Perfil',
          route: '/dashboard/perfil'
        },
        { title: 'Cambiar Contraseña', route: '/admin/perfil/cambiar-contrasena' },
      ]
    },
  ];



  // ════════════════════════════════════════════════════════════
  //  MÉTODOS PÚBLICOS
  // ════════════════════════════════════════════════════════════

  /**
   * Retorna los ítems del menú filtrados por el rol del usuario
   * y con los SVGs en crudo ya sanitizados para uso seguro.
   *
   * @param rolUsuario - El rol del usuario autenticado
   * @returns MenuItem[] - Menú filtrado y listo para renderizar
   */
  obtenerMenu(rolUsuario: string | undefined): MenuItem[] {
    // Clonar profundamente para no mutar la definición original
    const menuClonado = this.clonarMenu(this.menuDefinicion);

    // Filtrar por roles
    const menuFiltrado = this.filtrarPorRol(menuClonado, rolUsuario);

    // Sanitizar SVGs crudos
    this.sanitizarSvgs(menuFiltrado);

    return menuFiltrado;
  }

  // ════════════════════════════════════════════════════════════
  //  MÉTODOS PRIVADOS
  // ════════════════════════════════════════════════════════════

  /**
   * Clona profundamente el menú para evitar mutar la definición.
   * Se usa structuredClone pero sin clonar SafeHtml (no es clonable).
   */
  private clonarMenu(items: MenuItem[]): MenuItem[] {
    return items.map(item => {
      const clon: MenuItem = { ...item };
      if (item.submenu) {
        clon.submenu = this.clonarMenu(item.submenu);
      }
      return clon;
    });
  }

  /**
   * Filtra recursivamente los ítems que el usuario puede ver
   * según su rol. Si un ítem no tiene roles definidos, es visible
   * para todos.
   *
   * También elimina headings que quedarían vacíos (sin ítems
   * navegables debajo).
   */
  private filtrarPorRol(items: MenuItem[], rolUsuario: string | undefined): MenuItem[] {
    const filtrados = items.filter(item => {
      // Sin restricción de roles → visible para todos
      if (!item.roles || item.roles.length === 0) return true;

      // El rol del usuario debe estar en la lista permitida
      return rolUsuario ? item.roles.includes(rolUsuario as any) : false;
    });

    // Filtrar submenús recursivamente
    filtrados.forEach(item => {
      if (item.submenu) {
        item.submenu = this.filtrarPorRol(item.submenu, rolUsuario);
      }
    });

    // Eliminar headings que quedaron sin ítems navegables después
    return this.eliminarHeadingsVacios(filtrados);
  }

  /**
   * Elimina headings (títulos de sección) que no tienen ítems
   * navegables después de ellos.
   *
   * Ejemplo: si el heading "Administración" solo tiene ítems
   * para rol 'administrador' y el usuario es 'agente', se
   * elimina el heading vacío.
   */
  private eliminarHeadingsVacios(items: MenuItem[]): MenuItem[] {
    return items.filter((item, index) => {
      if (!item.heading) return true;

      // Buscar si hay al menos un ítem no-heading después de este heading
      const siguientes = items.slice(index + 1);
      for (const siguiente of siguientes) {
        if (siguiente.heading) break; // Llegamos al siguiente heading, no hay ítems
        return true; // Encontramos un ítem navegable
      }
      return false; // No hay ítems después de este heading
    });
  }

  /**
   * Detecta si un svgIcon es un SVG completo en crudo (contiene "<svg")
   * y lo sanitiza usando DomSanitizer para poder usar [innerHTML].
   *
   * Si es un path simple ("M3 12l2-2..."), no se sanitiza porque
   * se usa directamente en <path [attr.d]="...">.
   */
  private sanitizarSvgs(items: MenuItem[]): void {
    items.forEach(item => {
      if (item.svgIcon && this.esSvgCompleto(item.svgIcon)) {
        item.svgSanitizado = this.sanitizer.bypassSecurityTrustHtml(item.svgIcon);
      }
      if (item.submenu) {
        this.sanitizarSvgs(item.submenu);
      }
    });
  }

  /**
   * Determina si un string de icono es un SVG completo o solo un path.
   * Un SVG completo contiene la etiqueta "<svg".
   */
  esSvgCompleto(svgIcon: string): boolean {
    return svgIcon.trim().startsWith('<svg') || svgIcon.includes('<svg');
  }
}
