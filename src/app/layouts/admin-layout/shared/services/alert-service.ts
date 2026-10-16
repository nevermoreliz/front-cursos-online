import { Service, signal } from '@angular/core';

export type AlertType = 'success' | 'warning' | 'error' | 'info';

export interface Alert {
    id: number;
    tipo: AlertType;
    mensaje: string;
}

@Service()
export class AlertService {

    private _alertas = signal<Alert[]>([]);
    private _nextId = 0;

    readonly alertas = this._alertas.asReadonly();

    success(mensaje: string): void {
        this._agregar('success', mensaje);
    }

    warning(mensaje: string): void {
        this._agregar('warning', mensaje);
    }

    error(mensaje: string): void {
        this._agregar('error', mensaje);
    }

    info(mensaje: string): void {
        this._agregar('info', mensaje);
    }

    cerrar(id: number): void {
        this._alertas.update(alertas => alertas.filter(a => a.id !== id));
    }

    private _agregar(tipo: AlertType, mensaje: string): void {
        const id = this._nextId++;
        this._alertas.update(alertas => [...alertas, { id, tipo, mensaje }]);

        // Auto-cerrar después de 4 segundos
        setTimeout(() => this.cerrar(id), 4000);
    }
}
