import { Component, inject, signal } from '@angular/core';
import { ModalService } from '../../../layouts/admin-layout/shared/services/modal-service';
import { FormUsuario } from './form-usuario/form-usuario';
import { UsuarioInterface } from '../../../core/interfaces/usuario.interface';

@Component({
  imports: [FormUsuario],
  selector: 'app-usuario',
  styles: ``,
  templateUrl: './usuario.html',
})
export class Usuario {


  modalServices = inject(ModalService);


  /**--usuario seleccionado para editar-- */
  usuarioSeleccionado = signal<UsuarioInterface | null>(null)


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
