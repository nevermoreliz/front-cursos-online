import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// ──────────────────────────────────────────────────────────────
// Configuración raíz de la aplicación.
//
// Aquí se registran todos los "proveedores" globales:
// - Router → Navegación entre páginas
// - AnimationsAsync → Animaciones de Angular Material
// - HttpClient → Para hacer peticiones HTTP al backend
// - withInterceptors() → Registra nuestro interceptor que agrega
//   el token JWT automáticamente a cada petición
// ──────────────────────────────────────────────────────────────
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
      //                ↑ Aquí registramos nuestro interceptor.
      //                  Angular lo ejecutará en CADA petición HTTP.
    ),
  ]
};
