import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { IApiResponse } from '../interfaces/api.interface';

@Service()
export class PerfilService {

    private http = inject(HttpClient);

    // ─── URL base del backend ───
    private apiUrl = environment.apiUrl;

    actualizarPerfil(id: number, usuario: UsuarioInterface) {
        return this.http.put<IApiResponse<UsuarioInterface>>(`${this.apiUrl}/usuario/actualizar/${id}`, usuario);
    }
}
