import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

import { AuthService } from '../services/auth-service';
import { AuthStatus } from '../interfaces/auth.interface';

// ──────────────────────────────────────────────────────────────
// Auth Guard: Protege las rutas que REQUIEREN estar logueado.
//
// IMPORTANTE: Este guard ESPERA a que checkAuthStatus() termine.
//
// ¿Por qué esperar?
//   → Cuando el usuario recarga la página (F5), el AuthService
//     arranca con estado "checking" mientras pregunta al backend
//     si el token sigue vigente. Si no esperamos, el guard
//     ve "checking", asume que no hay sesión, y redirige al login
//     innecesariamente (¡borrando el token en el proceso!).
//
// ¿Cómo esperamos?
//   → Convertimos el signal authStatus en un Observable con
//     toObservable(), filtramos los valores "checking" (los
//     ignoramos), y tomamos solo el PRIMER valor que no sea
//     "checking". Ese será "authenticated" o "notAuthenticated".
// ──────────────────────────────────────────────────────────────
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya sabemos el estado (no es "checking"), respondemos inmediatamente.
  // Esto evita crear Observables innecesarios en navegaciones normales.
  const currentStatus = authService.authStatus();

  if (currentStatus !== AuthStatus.checking) {
    return currentStatus === AuthStatus.authenticated
      ? true
      : router.createUrlTree(['/auth/login']);
  }

  // Si todavía estamos verificando (checking), ESPERAMOS a que termine.
  // toObservable() convierte un signal en un Observable para poder
  // usar operadores de RxJS como filter, map, take.
  return toObservable(authService.authStatus).pipe(
    // filter() → Ignora los valores "checking". Solo deja pasar
    //            "authenticated" o "notAuthenticated".
    filter((status) => status !== AuthStatus.checking),

    // take(1) → Toma solo el PRIMER valor que pase el filtro.
    //           Después se desuscribe automáticamente (limpieza).
    take(1),

    // map() → Transforma el estado en true (puede pasar)
    //         o en una redirección al login (no puede pasar).
    map((status) => {
      if (status === AuthStatus.authenticated) {
        return true;
      }
      return router.createUrlTree(['/auth/login']);
    })
  );
};
