import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ModalService } from '../../../../layouts/admin-layout/shared/services/modal-service';
import { ConfirmService } from '../../../../layouts/admin-layout/shared/services/confirm-service';
import { AlertService } from '../../../../layouts/admin-layout/shared/services/alert-service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ModalDirective } from '../../../../layouts/admin-layout/shared/directives/modal-directive';
import { UsuarioInterface } from '../../../../core/interfaces/usuario.interface';
import { UsuarioService } from '../../../../core/services/usuario-service';

@Component({
  imports: [ReactiveFormsModule, MatProgressSpinner, ModalDirective],
  selector: 'app-form-usuario',
  styles: ``,
  templateUrl: './form-usuario.html',
})
export class FormUsuario {


  // fb = inject(FormBuilder);
  fb = inject(NonNullableFormBuilder);
  usuarioService = inject(UsuarioService);

  modalService = inject(ModalService);
  confirmService = inject(ConfirmService);
  alertService = inject(AlertService);

  /** Outputs para eventos que avisa al padre que se creo un registro o se edito*/
  created = output<void>();
  edited = output<void>();

  /** Usuario seleccionado para editar [Si es null se asume que es crear]*/
  usuario = input<UsuarioInterface | null>(null)

  /** Estado de carga mientras se guardan los cambios */
  isSaving = signal(false);

  /** formulario Usuario */
  form: FormGroup = this.fb.group({
    nombre_completo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rol: ['', Validators.required],
  })

  constructor() {
    // 1. effect() es un "vigilante" automático de Angular
    effect(() => {
      // 2. Leemos la Signal this.usuario().
      // Al poner los paréntesis (), effect() detecta que debe vigilar esta variable.
      const usuarioEditar = this.usuario();

      // 3. ¿El componente padre nos mandó un registro con datos? (Modo Editar)
      if (usuarioEditar) {
        // patchValue() busca las cajas del formulario que se llamen igual 
        // que las propiedades del objeto (nombre_completo, email, rol) y las rellena solas.
        this.form.patchValue(usuarioEditar);
      }
      // 4. ¿El padre nos mandó null? (Modo Crear nuevo)
      else {
        // reset() borra todo lo que estaba escrito y deja las cajas en blanco.
        this.form.reset();
      }

    })
  }

  guardarCambios() {

    // 1. Validar: Si el formulario tiene errores, mostramos las alertas rojas y salimos
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // 2. Activamos el spinner de carga
    this.isSaving.set(true);

    // 3. Obtenemos los datos escritos en el formulario
    const datosFormulario = this.form.value;

    // 4. Obtener el registro que la tabla padre nos envió (si es que envió uno)
    const usuarioSeleccionado = this.usuario()

    // 5. ¿La tabla nos envió un registro con ID? -> MODO EDITAR
    if (usuarioSeleccionado && usuarioSeleccionado.id) {
      this.actualizarUsuario(usuarioSeleccionado.id, datosFormulario)
    } else {
      this.crearUsuario(datosFormulario)
    }

  }


  /** funcion de crear usuario */
  crearUsuario(datos: UsuarioInterface) {
    this.usuarioService.createUsuario(datos).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.alertService.success(res.msg);
        this.form.reset();
        this.created.emit();
        this.cerrar();
      },
      error: (err) => {
        this.isSaving.set(false);
        this.alertService.error(err.msg);
        console.error('err', err);
      }
    })

  }

  /** funcion de actualizar usuario */
  actualizarUsuario(id: number, datos: UsuarioInterface) {
    // this.usuarioService.updateUsuario(id, datos).subscribe({
    //   next: (res) => {
    //     this.isSaving.set(false);
    //     this.alertService.success(res.msg);
    //     this.edited.emit();
    //     this.cerrar();
    //   },
    //   error: (err) => {
    //     this.isSaving.set(false);
    //     this.alertService.error(err.msg);
    //     console.error('err', err);
    //   }
    // })
  }


  /** cerrar formulario [Modal] */
  cerrar() {
    this.form.reset();
    this.modalService.cerrar('formUsuario');
  }



}


