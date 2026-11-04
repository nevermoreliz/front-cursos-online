import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlContainer, FormGroupDirective } from '@angular/forms';
import { merge, Observable, Subscription } from 'rxjs';
import { obtenerMensajeError } from '../../../core/utils/form-errors';

/**
 * ═════════════════════════════════════════════════════════════════════
 * COMPONENTE REUTILIZABLE: <app-form-error>
 * ─────────────────────────────────────────────────────────────────────
 * Muestra el mensaje de validación con estilo Tailwind y el icono rojo.
 * Es 100% reactivo: se actualiza en tiempo real al escribir, perder el foco,
 * o al presionar "Guardar" (submit / markAllAsTouched).
 *
 * MODOS DE USO:
 * 1. Por nombre dentro de un [formGroup] (Recomendado):
 *    <app-form-error controlName="email" label="El correo" />
 *
 * 2. Pasando el control directamente:
 *    <app-form-error [control]="form.get('email')" label="El correo" />
 *
 * 3. Mensaje manual / estático:
 *    <app-form-error [error]="'Mensaje personalizado'" />
 * ═════════════════════════════════════════════════════════════════════
 */
@Component({
  selector: 'app-form-error',
  standalone: true,
  host: {
    class: 'block',
  },
  template: `
    @if (mensaje()) {
      <p class="mt-1.5 flex items-center gap-1 text-xs text-red-500">
        <!-- Icono de advertencia en color rojo -->
        <svg class="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <!-- Mensaje traducido automáticamente al español -->
        <span>{{ mensaje() }}</span>
      </p>
    }
  `,
})
export class FormError implements OnInit {
  private controlContainer = inject(ControlContainer, { optional: true });
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private sub?: Subscription;

  /** Nombre del campo en el formulario padre (ej: controlName="email") */
  controlName = input<string>('');

  /** Control directo (ej: [control]="form.get('email')") */
  control = input<AbstractControl | null>(null);

  /** Etiqueta descriptiva (ej: label="El correo electrónico") */
  label = input<string>('');

  /** Mensaje de error personalizado directo */
  error = input<string | null>(null);

  /** Señal reactiva que contiene el mensaje a mostrar */
  mensaje = signal<string | null>(null);

  constructor() {
    // Si cambian los inputs, reconfiguramos y recalculamos
    effect(() => {
      this.control();
      this.controlName();
      this.label();
      this.error();

      this.configurarSuscripciones();
      this.actualizarMensaje();
    });
  }

  ngOnInit(): void {
    this.configurarSuscripciones();
    this.actualizarMensaje();
  }

  /**
   * Resuelve el AbstractControl correspondiente
   */
  get controlResuelto(): AbstractControl | null {
    if (this.control()) {
      return this.control();
    }
    const name = this.controlName();
    if (name && this.controlContainer) {
      const container = this.controlContainer as any;
      const formGroup = container.formDirective?.form || container.form || container.control;
      if (formGroup && typeof formGroup.get === 'function') {
        return formGroup.get(name);
      }
    }
    return null;
  }

  /**
   * Recalcula el mensaje de error y actualiza la señal reactiva
   */
  actualizarMensaje(): void {
    if (this.error()) {
      this.mensaje.set(this.error());
      this.cdr.markForCheck();
      return;
    }

    const ctrl = this.controlResuelto;
    const msg = obtenerMensajeError(ctrl, this.label());
    this.mensaje.set(msg);
    this.cdr.markForCheck();
  }

  /**
   * Escucha los eventos de cambio de valor, estado, foco y envío del formulario
   */
  private configurarSuscripciones(): void {
    this.sub?.unsubscribe();

    const sources: Observable<unknown>[] = [];
    const ctrl = this.controlResuelto;

    if (ctrl) {
      if (ctrl.events) {
        sources.push(ctrl.events);
      }
      if (ctrl.statusChanges) {
        sources.push(ctrl.statusChanges);
      }
      if (ctrl.valueChanges) {
        sources.push(ctrl.valueChanges);
      }
    }

    const container = this.controlContainer as any;
    const submit$ = container?.ngSubmit || container?.formDirective?.ngSubmit;
    if (submit$) {
      sources.push(submit$);
    }

    if (sources.length > 0) {
      this.sub = merge(...sources)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.actualizarMensaje();
        });
    }
  }
}
