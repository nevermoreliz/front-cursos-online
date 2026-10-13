import { Service } from '@angular/core';

@Service()
export class ModalService {

    /**
      * Registra los modales automáticamente desde la directiva o componente,
      * almacenados por un ID único (string).
      */
    private modales = new Map<string, HTMLDialogElement>();

    /** Registra un modal por su ID */
    registrar(id: string, elemento: HTMLDialogElement): void {
        this.modales.set(id, elemento);
    }

    /** Elimina un modal del registro (cuando el componente se destruye) */
    desregistrar(id: string): void {
        this.modales.delete(id);
    }

    /**
     * Abre el modal con el ID dado.
     * Usa show() en vez de showModal() para que el modal NO entre al "top layer"
     * del navegador. Esto permite que las alertas (position: fixed + z-index alto)
     * se muestren por encima del modal.
     */
    abrir(id: string): void {
        const modal = this.modales.get(id);
        if (modal) {
            modal.show();
        } else {
            console.warn(`[ModalService] No se encontró modal con id: "${id}"`);
        }
    }

    /** Cierra el modal con el ID dado */
    cerrar(id: string): void {
        const modal = this.modales.get(id);
        if (modal) {
            modal.close();
        }
    }

}
