import { Routes } from '@angular/router';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import Perfil from './perfil/perfil';
import { Dashboard } from './home/dashboard';
import { Usuario } from './usuario/usuario';


export const dashboardRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: Dashboard,
      },
      {
        path: 'perfil',
        component: Perfil,
      },
      {
        path: 'usuario',
        component: Usuario,
      },
      {
        path: '**',
        redirectTo: '/',
      }
    ],
  }
];

export default dashboardRoutes;

