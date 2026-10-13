import { Component, effect, inject, output } from '@angular/core';
import { ModalDirective } from '../../../../shared/directives/modal-directive';
import { ModalService } from '../../../../shared/services/modal-service';
import { UsuarioInterface } from '../../../../core/interfaces/usuario.interface';
import { AuthService } from '../../../../core/services/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilService } from '../../../../core/services/perfil-service';
import { IApiResponse } from '../../../../core/interfaces/api.interface';

@Component({
  imports: [ModalDirective, ReactiveFormsModule],
  selector: 'form-perfil',
  styles: ``,
  templateUrl: './form-perfil.html',
})
export class FormPerfil {

  fb = inject(FormBuilder);

  modalService = inject(ModalService);
  authService = inject(AuthService);
  perfilService = inject(PerfilService);


  //Eventos que avisa al padre que se creo o edito un registro
  edited = output<void>();

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

  cerrar() {
    this.modalService.cerrar('formPerfil');
  }


  guardarCambios() {
    /** id del usuario que se esta editando */
    const id = this.currentUser()?.id;

    /** si no hay usuario, no se puede editar */
    if (!id) return;

    const body: UsuarioInterface = this.form.value;

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
        this.edited.emit();
        this.cerrar();
      },
      error: (error) => {
        console.error(error);
      }
    });

  }


  /** llenar formulario con los datos del usuario autenticado */

  llenarFormulario(usuario: UsuarioInterface) {
    this.form.patchValue({
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
    })
  }



}
