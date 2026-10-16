import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth-service';
import { FormPerfil } from './form-perfil/form-perfil';
import { ModalService } from '../../../layouts/admin-layout/shared/services/modal-service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormPerfil],
  templateUrl: './perfil.html',
})
export default class Perfil {

  authService = inject(AuthService);
  modalServices = inject(ModalService);


  twoFactorEnabled = signal(false);

  currentUser = this.authService.currentUser;

  toggleTwoFactor() {
    this.twoFactorEnabled.update(v => !v);
  }


  /**--modales-- */

  abrirModalEditar() {
    this.modalServices.abrir('formPerfil');
  }

  /**--end modales-- */

}
