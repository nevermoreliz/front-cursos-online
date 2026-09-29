import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';

import { AuthService } from '../services/auth-service';
import { AuthStatus } from '../interfaces/auth.interface';

// ──────────────────────────────────────────────────────────────
// Public Guard: Protege las rutas PÚBLICAS como el login.
//
// Al igual que el AuthGuard, este guard ESPERA a que
// checkAuthStatus() termine antes de decidir.
//
// Si no esperamos, al recargar la página el estado sería
// "checking", el guard dejaría pasar al login, y mientras
// tanto checkAuthStatus() podría fallar y borrar el token.
// ──────────────────────────────────────────────────────────────
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya sabemos el estado, respondemos inmediatamente.
  const currentStatus = authService.authStatus();

  if (currentStatus !== AuthStatus.checking) {
    return currentStatus === AuthStatus.authenticated
      ? router.createUrlTree(['/dashboard'])
      : true;
  }

  // Si estamos verificando, esperamos a que termine.
  return toObservable(authService.authStatus).pipe(
    filter((status) => status !== AuthStatus.checking),
    take(1),
    map((status) => {
      if (status === AuthStatus.authenticated) {
        // Ya está logueado → no necesita ver el login, ir al dashboard
        return router.createUrlTree(['/dashboard']);
      }
      // No está logueado → puede ver el login normalmente
      return true;
    })
  );
};
