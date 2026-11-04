import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { merge, Observable } from 'rxjs';

/**
 * ═════════════════════════════════════════════════════════════════════
 * DIRECTIVA REUTILIZABLE: appInputError
 * ─────────────────────────────────────────────────────────────────────
 * Aplica automáticamente las clases de Tailwind de error (borde rojo y
 * anillo de enfoque rojo) cuando el campo es inválido y fue tocado/modificado.
 *
 * USO HABITUAL:
 *   <input type="text" formControlName="nombre" appInputError />
 *
 * O con valor booleano manual:
 *   <input type="text" [appInputError]="miCondicion" />
 * ═════════════════════════════════════════════════════════════════════
 */
@Directive({
  selector: '[appInputError]',
  standalone: true,
  host: {
    '[class.!border-red-500]': 'mostrarError',
    '[class.!focus:border-red-500]': 'mostrarError',
    '[class.!focus:ring-red-500/10]': 'mostrarError',
  },
})
export class InputErrorDirective implements OnInit {
  private ngControl = inject(NgControl, { optional: true });
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  /**
   * Permite sobreescribir el estado manualmente si se pasa un valor booleano:
   * [appInputError]="miCondicion"
   */
  customInvalido = input<boolean | string | undefined>(undefined, { alias: 'appInputError' });

  get mostrarError(): boolean {
    // Si se pasa explícitamente [appInputError]="true/false"
    if (typeof this.customInvalido() === 'boolean') {
      return this.customInvalido() as boolean;
    }

    // Por defecto, evalúa el estado del control reactivo asociado
    const control = this.ngControl?.control;
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  ngOnInit(): void {
    const ctrl = this.ngControl?.control;
    if (ctrl) {
      const sources: Observable<unknown>[] = [];
      if (ctrl.events) sources.push(ctrl.events);
      if (ctrl.statusChanges) sources.push(ctrl.statusChanges);
      if (ctrl.valueChanges) sources.push(ctrl.valueChanges);

      if (sources.length > 0) {
        merge(...sources)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.cdr.markForCheck();
          });
      }
    }
  }
}
