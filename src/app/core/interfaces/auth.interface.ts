import { UsuarioInterface } from "./usuario.interface";

// ─── Lo que ENVIAMOS al backend cuando el usuario hace login ───
// El formulario tiene email y password, esto define exactamente esa forma.
export interface LoginRequest {
    email: string;
    password: string;
}

// ─── Lo que el backend nos DEVUELVE dentro de "data" ───
// Contiene el usuario logueado y su token JWT.
export interface AuthDataResponse {
    usuario: UsuarioInterface;
    token: string;
}

// ─── La respuesta COMPLETA del backend ───
// Envuelve AuthDataResponse con un ok, un mensaje, y los datos.
export interface AuthResponse {
    ok?: boolean;
    msg: string;
    data: AuthDataResponse;
}

// ─── Los 3 posibles estados de autenticación ───
// "checking"          → Estamos verificando si hay sesión (al cargar la app)
// "authenticated"     → El usuario está logueado
// "notAuthenticated"  → No hay sesión activa
export enum AuthStatus {
    checking = 'checking',
    authenticated = 'authenticated',
    notAuthenticated = 'notAuthenticated'
}