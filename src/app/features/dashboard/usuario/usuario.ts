import { Component, computed, inject, signal } from '@angular/core';
import { ModalService } from '../../../layouts/admin-layout/shared/services/modal-service';
import { FormUsuario } from './form-usuario/form-usuario';
import { UsuarioInterface } from '../../../core/interfaces/usuario.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { UsuarioService } from '../../../core/services/usuario-service';
import { IParametrosPaginacion } from '../../../core/interfaces/parametros-paginacion.interface';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { usePaginacion } from '../../../layouts/admin-layout/shared/utils/use-paginacion';

@Component({
  imports: [
    FormUsuario,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinner,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  selector: 'app-usuario',
  styles: `
    /* ── Override de mat-form-field para integrarlo con el diseño Tailwind ── */

    /* Contenedor: quitar el padding y subscript space por defecto */
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;               /* Oculta el espacio reservado para hint/error */
    }

    /* El outline del form-field: bordes redondeados como tu diseño */
    :host ::ng-deep .mdc-notched-outline__leading,
    :host ::ng-deep .mdc-notched-outline__notch,
    :host ::ng-deep .mdc-notched-outline__trailing {
      border-color: rgb(209 213 219) !important;   /* gray-300 */
    }

    :host ::ng-deep .mdc-notched-outline__leading {
      border-radius: 0.5rem 0 0 0.5rem !important; /* rounded-lg izquierda */
    }
    :host ::ng-deep .mdc-notched-outline__trailing {
      border-radius: 0 0.5rem 0.5rem 0 !important; /* rounded-lg derecha */
    }

    /* Cuando tiene foco: borde indigo */
    :host ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__leading,
    :host ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__notch,
    :host ::ng-deep .mat-mdc-form-field.mat-focused .mdc-notched-outline__trailing {
      border-color: rgb(99 102 241) !important;     /* indigo-500 */
    }

    /* Altura compacta para que coincida con h-9 */
    :host ::ng-deep .mat-mdc-form-field-infix {
      min-height: 36px !important;
      padding-top: 6px !important;
      padding-bottom: 6px !important;
    }

    /* Texto del input */
    :host ::ng-deep .mat-mdc-input-element,
    :host ::ng-deep .mat-mdc-select-value-text {
      font-size: 0.875rem !important; /* text-sm */
    }

    /* Ícono prefijo */
    :host ::ng-deep .mat-mdc-form-field-icon-prefix {
      padding-left: 12px !important;
      color: rgb(156 163 175) !important; /* gray-400 */
    }

    /* Label flotante */
    :host ::ng-deep .mat-mdc-floating-label {
      font-size: 0.875rem !important;
    }

    /* ── Dark mode ── */
    :host-context(.dark) ::ng-deep .mdc-notched-outline__leading,
    :host-context(.dark) ::ng-deep .mdc-notched-outline__notch,
    :host-context(.dark) ::ng-deep .mdc-notched-outline__trailing {
      border-color: rgb(55 65 81) !important;       /* gray-700 */
    }

    :host-context(.dark) ::ng-deep .mat-mdc-input-element {
      color: rgb(229 231 235) !important;            /* gray-200 */
    }

    :host-context(.dark) ::ng-deep .mat-mdc-select-value-text {
      color: rgb(209 213 219) !important;            /* gray-300 */
    }

    :host-context(.dark) ::ng-deep .mat-mdc-floating-label {
      color: rgb(156 163 175) !important;            /* gray-400 */
    }
  `,
  templateUrl: './usuario.html',
})
export class Usuario {

  modalServices = inject(ModalService);
  usuarioService = inject(UsuarioService);


  /**--usuario seleccionado para editar-- */
  usuarioSeleccionado = signal<UsuarioInterface | null>(null)


  // ── Paginación + búsqueda reutilizable ──
  paginacion = usePaginacion({ limit: 5, sortBy: 'id', sortOrder: 'DESC' });

  // Columnas que se mostrarán en la tabla de Material (en orden)
  displayedColumns: string[] = ['nombre_completo', 'email', 'rol', 'acciones'];

  // rxResource reactivo: se recarga automáticamente cuando cambian los parámetros
  usuariosResource = rxResource({
    params: () => this.paginacion.parametros(),
    stream: ({ params }) => this.usuarioService.getUsuarios(params as IParametrosPaginacion)
  });

  // Extraemos las filas y el total usando computed() para que el HTML quede limpio
  listaUsuarios = computed(() => this.usuariosResource.value()?.data ?? []);
  totalRegistros = computed(() => this.usuariosResource.value()?.paginacion?.total ?? 0);


  /**--modales-- */

  abrirModal() {
    this.usuarioSeleccionado.set(null);
    this.modalServices.abrir('formUsuario');
  }

  abrirModalEditar(usuario: UsuarioInterface) {
    this.usuarioSeleccionado.set(usuario);
    this.modalServices.abrir('formUsuario');
  }

  abrirModalInformacion(usuario: UsuarioInterface) {
    this.usuarioSeleccionado.set(usuario);
    this.modalServices.abrir('formUsuarioInformacion');
  }

  /**--end modales-- */
}