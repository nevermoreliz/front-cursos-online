import { AbstractControl } from '@angular/forms';

/**
 * ═════════════════════════════════════════════════════════════════════
 * DICCIONARIO CENTRAL DE ERRORES DE FORMULARIOS EN ESPAÑOL
 * ─────────────────────────────────────────────────────────────────────
 * Traduce automáticamente las claves de error generadas por los
 * `Validators` de Angular a mensajes legibles en español.
 * ═════════════════════════════════════════════════════════════════════
 */

/**
 * Tipo para las funciones que formatean cada tipo de error.
 */
type ErrorFormatter = (errorValue: any, label?: string) => string;

/**
 * Mapa de formateadores por tipo de validador estándar de Angular.
 */
const ERRORES_MAPA: Record<string, ErrorFormatter> = {
// 1. Campo requerido
  required: (_val, label) => {
    if (!label) return 'Este campo es obligatorio.';
    const esFemenino = label.trim().toLowerCase().startsWith('la');
    return `${label} es obligatori${esFemenino ? 'a' : 'o'}.`;
  },

  // 2. Correo electrónico inválido
  email: () =>
    'Ingresa un correo electrónico válido.',

  // 3. Longitud mínima de caracteres
  minlength: (val, label) => {
    const min = val?.requiredLength ?? '';
    return label
      ? `${label} debe tener al menos ${min} caracteres.`
      : `Debe tener al menos ${min} caracteres.`;
  },

  // 4. Longitud máxima de caracteres
  maxlength: (val, label) => {
    const max = val?.requiredLength ?? '';
    return label
      ? `${label} no puede superar los ${max} caracteres.`
      : `No puede superar los ${max} caracteres.`;
  },

  // 5. Valor numérico mínimo
  min: (val, label) => {
    const min = val?.min ?? '';
    return label
      ? `${label} no puede ser menor a ${min}.`
      : `El valor mínimo permitido es ${min}.`;
  },

  // 6. Valor numérico máximo
  max: (val, label) => {
    const max = val?.max ?? '';
    return label
      ? `${label} no puede ser mayor a ${max}.`
      : `El valor máximo permitido es ${max}.`;
  },

  // 7. Formato o patrón Regex no coincidente
  pattern: () =>
    'El formato ingresado no es válido.',

  // 8. Error personalizado pasado como mensaje de texto directo
  mensaje: (val) =>
    typeof val === 'string' ? val : 'El valor no es válido.',
};

/**
 * Función utilitaria principal para obtener el mensaje de error en español.
 *
 * @param control - El AbstractControl del formulario reactivo
 * @param label - Nombre legible opcional para contextualizar el mensaje (ej: 'El correo', 'La contraseña')
 * @returns El mensaje de error en español o `null` si el campo es válido o aún no ha sido tocado.
 */
export function obtenerMensajeError(
  control: AbstractControl | null,
  label?: string
): string | null {
  // Paso 1: Si no existe el control o no tiene errores, no hay nada que mostrar
  if (!control || !control.errors) {
    return null;
  }

  // Paso 2: Solo mostrar errores si el usuario ya interactuó con el campo
  // (evita que el formulario aparezca lleno de textos rojos al abrirse vacío)
  if (!control.touched && !control.dirty) {
    return null;
  }

  // Paso 3: Tomar la primera clave de error presente (ej: 'required', 'email', 'minlength')
  const primeraClave = Object.keys(control.errors)[0];
  const valorError = control.errors[primeraClave];

  // Paso 4: Buscar en nuestro diccionario la traducción correspondiente
  const formateador = ERRORES_MAPA[primeraClave];

  if (formateador) {
    return formateador(valorError, label);
  }

  // Paso 5: Fallback si el validador envió un string directo o un error no mapeado
  if (typeof valorError === 'string') {
    return valorError;
  }

  return 'Este campo contiene un valor no válido.';
}

/**
 * Helper para saber si un control es inválido y debe tener estilo de advertencia (borde rojo).
 */
export function esControlInvalido(control: AbstractControl | null): boolean {
  return !!(control && control.invalid && (control.touched || control.dirty));
}

