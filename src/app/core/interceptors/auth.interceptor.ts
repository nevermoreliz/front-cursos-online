import { HttpInterceptorFn } from '@angular/common/http';

// ──────────────────────────────────────────────────────────────
// Interceptor de Autenticación
//
// ¿Qué es un interceptor?
//   → Imagina que cada petición HTTP es una carta que envías.
//     El interceptor es como un "cartero" que, ANTES de enviar
//     la carta, le pega una estampilla (el token JWT).
//
// ¿Por qué NO inyectamos AuthService aquí?
//   → Porque causa una DEPENDENCIA CIRCULAR:
//     AuthService (constructor) → HTTP request → Interceptor → AuthService → 💥
//     En vez de eso, leemos el token directamente de localStorage.
//     Es más simple y evita el ciclo.
// ──────────────────────────────────────────────────────────────
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Leemos el token directamente de localStorage.
  // NO usamos inject(AuthService) para evitar dependencia circular.
  const token = localStorage.getItem('auth_token');

  // Si NO hay token, dejamos pasar la petición tal cual.
  if (!token) {
    return next(req);
  }

  // Si HAY token, "clonamos" la petición y le agregamos el header.
  //
  // ¿Por qué clonar? → Las peticiones HTTP en Angular son INMUTABLES
  // (no se pueden modificar). Así que creamos una copia con el
  // header extra. Es una regla de Angular, no nuestra decisión.
  const clonedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      //              ↑ "Bearer" es el estándar para tokens JWT.
      //                El backend espera exactamente este formato.
    },
  });

  // Enviamos la petición modificada (con el token incluido)
  return next(clonedReq);
};
