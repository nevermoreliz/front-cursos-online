export interface IApiResponse<T> {
    msg: string;
    data: T;
    paginacion?: IPaginacion;
    ok?: boolean;
}

export interface IApiError {
    error: string;
    msg?: Record<string, string[]>;
    ok?: boolean;
}

interface IPaginacion {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
