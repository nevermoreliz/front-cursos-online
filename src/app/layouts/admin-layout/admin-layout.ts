import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { LayoutService } from './layout.service';

/**
 * Contenedor del layout de gestión de cursos.
 *
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, Sidebar, Header],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  encapsulation: ViewEncapsulation.None,
})
export class AdminLayout {
  layoutService = inject(LayoutService);
}
