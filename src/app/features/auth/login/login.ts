import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth-service';

// ──────────────────────────────────────────────────────────────
// LoginComponent: La página del formulario de login.
//
// ¿Qué hace este componente?
//   1. Muestra el formulario (email + password)
//   2. Valida los campos (que no estén vacíos, email válido, etc.)
//   3. Al enviar, llama al AuthService para hacer login
//   4. Muestra un spinner mientras espera respuesta
//   5. Si es exitoso → redirige al dashboard
//   6. Si falla → muestra mensaje de error
//
// ¿Por qué la lógica de login NO está aquí?
//   → Porque el componente es solo la "cara" (la UI).
//     La lógica pesada (HTTP, tokens) está en el AuthService.
//     Esto se llama "separación de responsabilidades".
// ──────────────────────────────────────────────────────────────
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule, // ← Para el spinner de carga
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  // ─── Inyección de dependencias ───
  // inject() obtiene instancias de servicios que Angular ya creó.
  // Es como pedirle a Angular: "dame el AuthService que ya existe".
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // ─── Signals para el estado de la UI ───
  // Estos signals controlan lo que el usuario VE en pantalla.

  /** ¿Estamos esperando respuesta del servidor? → Mostrar spinner */
  isLoading = signal(false);

  /** ¿El login falló? → Mostrar mensaje de error */
  loginError = signal<string | null>(null);

  /** ¿Mostrar u ocultar la contraseña? → Alternar tipo de input */
  hidePassword = signal(true);

  // ─── Formulario reactivo ───
  // FormGroup agrupa los controles del formulario.
  // Validators define las reglas de validación.
  //
  // ¿Por qué "reactivo" y no template-driven?
  //   → Los formularios reactivos son más poderosos:
  //     - Puedes validar en TypeScript (no solo en HTML)
  //     - Son más fáciles de testear
  //     - Tienes control total del estado
  loginForm: FormGroup = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // ─── Getters ───
  // Atajos para acceder a los controles individuales desde el HTML.
  // Sin esto tendrías que escribir loginForm.get('email') cada vez.
  get emailControl()    { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  // ──────────────────────────────────────────────────────────
  // onSubmit(): Se ejecuta cuando el usuario hace clic en "Ingresar"
  // ──────────────────────────────────────────────────────────
  onSubmit(): void {
    // Si el formulario no es válido, marcamos todos los campos
    // como "touched" para que se muestren los mensajes de error.
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return; // No seguimos adelante
    }

    // Activamos el estado de carga y limpiamos errores anteriores
    this.isLoading.set(true);
    this.loginError.set(null);

    // Llamamos al servicio de autenticación.
    // .subscribe() "escucha" la respuesta del servidor.
    //
    // ¿Qué es subscribe?
    //   → Es como decir "avísame cuando tengas la respuesta".
    //     El Observable no hace NADA hasta que alguien se suscribe.
    //     Es como un grifo: el agua no sale hasta que lo abres.
    this.authService.login(this.loginForm.value).subscribe({

      // next → Se ejecuta cuando llega la respuesta
      next: (success) => {
        this.isLoading.set(false);

        if (success) {
          // Login exitoso → redirigir al dashboard 🎉
          this.router.navigateByUrl('/dashboard');
        } else {
          // El backend respondió pero las credenciales son incorrectas
          this.loginError.set('Credenciales incorrectas. Verifica tu email y contraseña.');
        }
      },

      // error → Se ejecuta si hay un error inesperado (ej: servidor caído)
      error: () => {
        this.isLoading.set(false);
        this.loginError.set('Error de conexión. Intenta nuevamente más tarde.');
      },
    });
  }
}
