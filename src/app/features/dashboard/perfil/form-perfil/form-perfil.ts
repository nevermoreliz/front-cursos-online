import { Component, effect, inject, output } from '@angular/core';
import { ModalDirective } from '../../../../layouts/admin-layout/shared/directives/modal-directive';
import { ModalService } from '../../../../layouts/admin-layout/shared/services/modal-service';
import { UsuarioInterface } from '../../../../core/interfaces/usuario.interface';
import { AuthService } from '../../../../core/services/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService } from '../../../../core/services/perfil-service';
import { IApiResponse } from '../../../../core/interfaces/api.interface';
import { ConfirmService } from '../../../../layouts/admin-layout/shared/services/confirm-service';
import { AlertService } from '../../../../layouts/admin-layout/shared/services/alert-service';

@Component({
  imports: [ModalDirective, ReactiveFormsModule],
  selector: 'form-perfil',
  styles: ``,
  templateUrl: './form-perfil.html',
})
export class FormPerfil {

  fb = inject(FormBuilder);

  authService = inject(AuthService);
  perfilService = inject(PerfilService);

  modalService = inject(ModalService);
  confirmService = inject(ConfirmService);
  alertService = inject(AlertService);

  currentUser = this.authService.currentUser;

  /** formulario Usuario -> para perfil */
  form: FormGroup = this.fb.group({
    nombre_completo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  })

  constructor() {

    /**
     * effect que se ejecuta cuando cambia el usuario autenticado
     */
    effect(() => {
      const usuario = this.currentUser();
      if (usuario) {
        this.llenarFormulario(usuario);
      }
    });

  }


  async guardarCambios() {
    /** Si el formulario NO es válido (incompleto o con errores) */
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.warning('Por favor completa todos los campos requeridos correctamente.');
      return;
    }

    /** id del usuario que se esta editando */
    const id = this.currentUser()?.id;

    /** si no hay usuario, no se puede editar */
    if (!id) return;

    /** agrupar datos de formulario */
    const body: UsuarioInterface = this.form.value;

    const confirmado = await this.confirmService.ask({
      title: 'Confirmar Actualización',
      text: '¿Estás seguro de que deseas actualizar tus datos?',
      confirmButtonText: 'Sí, actualizar',
      confirmButtonColor: 'success'
    });

    if (!confirmado) return;

    this.perfilService.actualizarPerfil(id, body).subscribe({
      next: (respuesta: IApiResponse<UsuarioInterface>) => {

        console.log('Respuesta del backend:', respuesta);

        // El backend puede devolver el usuario directamente o envuelto en { data: ... }
        const usuarioActualizado = respuesta.data ?? respuesta;

        // Mezclamos los datos actualizados con los existentes
        // para no perder campos como id, rol, activo, etc.
        const usuarioCompleto: UsuarioInterface = {
          ...this.currentUser()!,
          ...usuarioActualizado,
        };

        this.authService.actualizarUsuario(usuarioCompleto);

        this.alertService.success('¡Perfil actualizado exitosamente!');

        this.cerrar();
      },
      error: (error) => {
        console.error(error);
        this.alertService.error(error?.error?.message || 'Error al actualizar el perfil.');
      }
    });

  }


  /** cerrar formulario [Modal] */
  cerrar() {
    this.modalService.cerrar('formPerfil');
  }

  /** llenar formulario con los datos del usuario autenticado */

  llenarFormulario(usuario: UsuarioInterface) {
    this.form.patchValue({
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
    })
  }



}
