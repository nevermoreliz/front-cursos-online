import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import {
    AuthResponse,
    AuthStatus,
    LoginRequest,
} from '../interfaces/auth.interface';

// ──────────────────────────────────────────────────────────────
// AuthService: El "cerebro" de la autenticación.
//
// ¿Por qué un servicio y no poner la lógica en el componente?
//   → Porque MUCHOS componentes necesitan saber si el usuario
//     está logueado (el menú, el guard, el dashboard, etc.).
//     El servicio es ÚNICO para toda la app (singleton) y
//     todos pueden consultarlo.
//
// ¿Qué son los "signals"?
//   → Son variables reactivas de Angular. Cuando cambian,
//     todo lo que las usa se actualiza automáticamente.
//     Piensa en ellos como variables "inteligentes".
// ──────────────────────────────────────────────────────────────
@Service()
export class AuthService {

    // ─── Dependencias inyectadas ───
    // inject() es la forma moderna de Angular para obtener servicios.
    // Es equivalente a ponerlos en el constructor, pero más limpio.
    private http = inject(HttpClient);
    private router = inject(Router);

    // ─── URL base del backend ───
    private apiUrl = environment.apiUrl;

    // ─── Estado interno (privado) ───
    // Usamos signal() para que sean reactivos.
    // Son PRIVADOS porque nadie de afuera debe modificarlos directamente.
    // Solo el propio servicio debe cambiar estos valores.

    // Estado de autenticación: ¿estamos verificando, logueados, o no logueados?
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    // Datos del usuario actual (null si no está logueado)
    private _currentUser = signal<UsuarioInterface | null>(null);

    // ─── Estado público (solo lectura) ───
    // Exponemos versiones de SOLO LECTURA con .asReadonly()
    // para que los componentes puedan LEER pero NO modificar.

    /** El estado actual de autenticación (checking, authenticated, notAuthenticated) */
    public authStatus = this._authStatus.asReadonly();

    /** Los datos del usuario logueado, o null si no hay sesión */
    public currentUser = this._currentUser.asReadonly();

    // ─── Valores "computed" (derivados) ───
    // computed() crea un valor que se RECALCULA automáticamente
    // cada vez que el signal del que depende cambia.
    // Es como una fórmula de Excel: si cambias la celda A1,
    // la celda B1 que dice "=A1*2" se actualiza sola.

    /** ¿El usuario está autenticado? true/false simple */
    public isAuthenticated = computed(
        () => this._authStatus() === AuthStatus.authenticated
    );

    // ──────────────────────────────────────────────────────────
    // Constructor: se ejecuta UNA sola vez cuando la app arranca.
    // Aquí verificamos si ya había una sesión guardada.
    // ──────────────────────────────────────────────────────────
    constructor() {
        this.checkAuthStatus();
    }

    // ════════════════════════════════════════════════════════════
    //  MÉTODOS PÚBLICOS (los que usan los componentes y guards)
    // ════════════════════════════════════════════════════════════

    /**
     * Hace login enviando email y password al backend.
     *
     * ¿Qué es un Observable?
     *   → Es como una "promesa mejorada". Representa un valor
     *     que llegará en el FUTURO (la respuesta del servidor).
     *     Usamos .subscribe() para "escuchar" cuando llegue.
     *
     * ¿Qué hace pipe()?
     *   → Encadena operaciones sobre el Observable.
     *     Es como una tubería: el dato entra, pasa por tap(),
     *     luego por map(), y al final sale transformado.
     *
     * @returns Observable<boolean> → true si el login fue exitoso
     */
    login(credentials: LoginRequest): Observable<boolean> {
        return this.http
            .post<AuthResponse>(`${this.apiUrl}/auth/iniciar-sesion`, credentials)
            .pipe(
                // tap() → Ejecuta un "efecto secundario" sin modificar el dato.
                //         Aquí guardamos el token y el usuario.
                tap((response) => this.setAuthentication(response.data)),

                // map() → TRANSFORMA el dato. Convertimos la respuesta
                //         completa del backend en un simple true/false.
                map(() => true),

                // catchError() → Si algo sale mal (error 401, red, etc.),
                //                lo interceptamos aquí en vez de que la app explote.
                //                Limpiamos la sesión y devolvemos false.
                catchError(() => {
                    this.clearAuthentication();
                    return of(false); // of() crea un Observable con un valor fijo
                })
            );
    }

    /**
     * Cierra la sesión del usuario.
     * Limpia el token, los datos del usuario, y redirige al login.
     */
    logout(): void {
        this.clearAuthentication();
        this.router.navigateByUrl('/auth/login');
    }

    /**
     * Verifica si hay una sesión activa al iniciar la app.
     *
     * ¿Por qué es necesario?
     *   → Cuando el usuario recarga la página (F5), Angular se
     *     reinicia desde cero. Pero el token sigue en localStorage.
     *     Este método lo recupera y pregunta al backend si sigue
     *     siendo válido.
     */
    checkAuthStatus(): void {
        const token = localStorage.getItem('auth_token');

        // Si no hay token guardado, no hay sesión
        if (!token) {
            console.log('[AuthService] No hay token en localStorage');
            this._authStatus.set(AuthStatus.notAuthenticated);
            return;
        }

        console.log('[AuthService] Token encontrado, verificando con el backend...');

        // Si hay token, le preguntamos al backend si sigue siendo válido.
        // El endpoint /auth/check-token devuelve los datos actualizados del usuario.
        this.http
            .get<AuthResponse>(`${this.apiUrl}/auth/verificar-token`)
            .subscribe({
                // Si el backend responde OK → sesión válida
                next: (response) => {
                    console.log('[AuthService] ✅ Token válido, respuesta:', response);
                    this.setAuthentication(response.data);
                },

                // Si responde error → logueamos para diagnosticar
                error: (err) => {
                    console.error('[AuthService → checkAuthStatus]', err);
                    this.clearAuthentication();
                },
            });
    }

    /**
     * Obtiene el token JWT guardado en localStorage.
     * Lo usa el Interceptor para adjuntarlo a las peticiones HTTP.
     */
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    // ════════════════════════════════════════════════════════════
    //  MÉTODOS PRIVADOS (solo los usa este servicio internamente)
    // ════════════════════════════════════════════════════════════

    /**
     * Guarda el token y los datos del usuario tras un login exitoso.
     * Centralizar esto evita repetir código en login() y checkAuthStatus().
     */
    private setAuthentication(data: { usuario: UsuarioInterface; token: string }): void {
        // Guardar token en localStorage para que sobreviva un F5
        localStorage.setItem('auth_token', data.token);

        // Actualizar los signals (esto notifica a toda la app)
        this._currentUser.set(data.usuario);
        this._authStatus.set(AuthStatus.authenticated);
    }

    /**
     * Limpia todos los datos de sesión.
     * Se usa en logout() y cuando el token es inválido.
     */
    private clearAuthentication(): void {
        localStorage.removeItem('auth_token');
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.notAuthenticated);
    }
}
