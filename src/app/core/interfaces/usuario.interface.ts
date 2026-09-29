export interface UsuarioInterface {
    id?: number;
    nombre_completo: string;
    email: string;
    password_hash?: string;
    rol?: string;
    activo?: boolean;
    creado_en?: string;
    actualizado_en?: string;
}

