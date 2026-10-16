import { Service, signal } from '@angular/core';


export interface ConfirmOptions {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: 'primary' | 'error' | 'success' | 'warning' | 'info';
}


@Service()
export class ConfirmService {
    // Mantiene el estado visible de la confirmación
    options = signal<ConfirmOptions | null>(null);

    // Almacena la función para resolver la promesa
    private resolver: ((value: boolean) => void) | null = null;

    /**
     * Abre el modal global con el estilo SweetAlert y retorna una promesa iterativa
     */
    ask(opciones: ConfirmOptions): Promise<boolean> {
        this.options.set({
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'primary',
            ...opciones
        });

        return new Promise((resolve) => {
            this.resolver = resolve;
        });
    }

    /**
     * Responde interno lanzado desde el diálogo html true/false
     */
    respond(result: boolean) {
        if (this.resolver) {
            this.resolver(result);
        }
        // Cierra el modal limpiando las opciones
        this.options.set(null);
        this.resolver = null;
    }
}
