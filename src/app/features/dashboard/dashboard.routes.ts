import { Routes } from '@angular/router';
import { AdminLayout } from '../../layouts/admin-layout/admin-layout';
import Perfil from './perfil/perfil';
import { Dashboard } from './home/dashboard';


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
    ],
  }
];

export default dashboardRoutes;

