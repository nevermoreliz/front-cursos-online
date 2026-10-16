import { Directive, ElementRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../services/modal-service';



/**
 * Directiva que registra automáticamente un <dialog> en el ModalService.
 *
 * Uso:
 *   <dialog appModal="editarPerfil" class="modal">
 *     ...
 *   </dialog>
 *
 * Luego desde cualquier componente:
 *   modalService.abrir('editarPerfil');
 *   modalService.cerrar('editarPerfil');
 */
@Directive({
  selector: '[appModal]',
})
export class ModalDirective implements OnInit, OnDestroy {

  @Input({ required: true }) appModal!: string;

  private modalService = inject(ModalService);
  private elementRef = inject(ElementRef<HTMLDialogElement>);

  ngOnInit(): void {
    // Aseguramos que el modal use la tipografía del Admin Layout (Outfit)
    this.elementRef.nativeElement.classList.add('font-sans');

    // Movemos el modal al body para que no quede atrapado por el z-index de otros contenedores (como el sidebar/header)
    document.body.appendChild(this.elementRef.nativeElement);
    this.modalService.registrar(this.appModal, this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.modalService.desregistrar(this.appModal);
    // Limpiamos el DOM cuando el componente padre se destruye
    this.elementRef.nativeElement.remove();
  }
}
