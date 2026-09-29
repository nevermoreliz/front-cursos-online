import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';

export const routes: Routes = [
  // ──────────────────────────────────────
  // Páginas públicas (Tailwind + DaisyUI)
  // ──────────────────────────────────────
  {
    path: '',
    component: PublicLayout,
    children: [
      // Aquí irán las rutas públicas: landing, cursos, etc.
      // Ejemplo:
      // { path: '', loadComponent: () => import('./features/public/home/home').then(m => m.Home) },
    ],
  },

  // ──────────────────────────────────────
  // Autenticación (Angular Material)
  // canActivate: [publicGuard]
  //   → Si el usuario YA está logueado, el publicGuard
  //     lo redirige al dashboard (no necesita ver el login).
  // ──────────────────────────────────────
  {
    path: 'auth',
    component: AuthLayout,
    canActivate: [publicGuard],
    children: [
      // Aquí irán login, registro, etc.
      // Ejemplo:
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes'),
      }
    ],
  },

  // ──────────────────────────────────────
  // Dashboard / Admin (Angular Material)
  // canActivate: [authGuard]
  //   → Si el usuario NO está logueado, el authGuard
  //     lo redirige al login. Solo usuarios autenticados
  //     pueden acceder a esta sección.
  // ──────────────────────────────────────
  {
    path: 'dashboard',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      // Aquí irán las rutas del dashboard
      // Ejemplo:
      // { path: '', loadComponent: () => import('./features/dashboard/home/home').then(m => m.DashboardHome) },
    ],
  },
];

