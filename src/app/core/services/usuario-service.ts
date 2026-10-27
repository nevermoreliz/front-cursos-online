import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { Observable, tap } from 'rxjs';
import { IApiResponse } from '../interfaces/api.interface';
import { IParametrosPaginacion } from '../interfaces/parametros-paginacion.interface';

@Service()
export class UsuarioService {

    http = inject(HttpClient)

    // ─── URL base del backend ───
    private apiUrl = environment.apiUrl;

    getUsuarios(parametrosPaginacion?: IParametrosPaginacion): Observable<IApiResponse<UsuarioInterface[]>> {

        let params = new HttpParams();

        if (parametrosPaginacion) {
            Object.entries(parametrosPaginacion).forEach(([key, value]) => {
                // params = params.set(key, value.toString());

                if (value !== undefined && value !== null && value !== '') {
                    params = params.set(key, value)
                }
            })
        }

        return this.http.get<IApiResponse<UsuarioInterface[]>>(`${this.apiUrl}/usuario/listar`,
            { params }
        ).pipe(
            tap(response => response)
        );
    }

    createUsuario(usuario: UsuarioInterface): Observable<IApiResponse<UsuarioInterface>> {
        return this.http.post<IApiResponse<UsuarioInterface>>(`${this.apiUrl}/usuario/crear`, usuario);
    }
}
