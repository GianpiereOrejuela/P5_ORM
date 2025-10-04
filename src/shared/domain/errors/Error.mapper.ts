import { z } from "zod";
import {
    ValidationError,
    PropertyRequiredError,
    DuplicateError,
    DatabaseError,
} from "./ApplicationError.js";
import { OperationTracker } from "../../infrastructures/loggins/LoggerService.js";

/**
 * @description Mapea un ZodError a una de las clases de errores personalizadas de la aplicación.
 * @param zodError - El error de validación de Zod.
 * @returns - Un error personalizado (ValidationError o subclase).
 */
export function mapZodToCustomError(zodError: z.ZodError): ValidationError {
    const firstError = zodError.errors[0] || {
        code: "unknown",
        message: "Error desconocido",
        path: [],
        expected: "any",
        received: "undefined",
    };

    // Convierte código de Zod a error personalizado
    switch (firstError.code) {
        case "invalid_type":
            if (firstError.received === "undefined") {
                // Campo requerido no presente
                return new PropertyRequiredError(firstError.path.join("."));
            }
            return new ValidationError(
                `Datos inválidos en ${firstError.path.join(".")}: se esperaba ${
                    firstError.expected
                }, se recibió ${firstError.received}`
            );

        case "too_small":
        case "too_big":
            // Lógica para manejar límites de tamaño/valor (number o string)
            const typeMsg = firstError.type === "number" ? "valor" : "longitud";
            const limit = firstError.code === "too_small" ? firstError.minimum : firstError.maximum;
            const verb = firstError.code === "too_small" ? "menor" : "mayor";

            return new ValidationError(
                `El ${typeMsg} de ${firstError.path.join(
                    "."
                )} es inválido: debe ser ${verb} a ${limit}.`
            );

        case "invalid_string":
            // Lógica para email, regex, etc.
            if (firstError.validation === "email") {
                return new ValidationError(`Formato de correo electrónico inválido.`);
            }
            if (firstError.path.includes("password")) {
                return new ValidationError(
                    `La contraseña no cumple con los requisitos de seguridad.`
                );
            }
            return new ValidationError(
                `Formato inválido para ${firstError.path.join(".")}: ${firstError.message}`
            );

        case "custom":
            // Manejo de errores custom (ej. validaciones de duplicados a nivel Zod)
            if (
                firstError.message.toLowerCase().includes("duplicado") ||
                firstError.message.toLowerCase().includes("ya existe")
            ) {
                const field = firstError.path.join(".");
                // Nota: Idealmente, el valor se pasaría desde la validación custom de Zod
                return new DuplicateError("Recurso", field, "valor proporcionado");
            }
            return new ValidationError(firstError.message);

        default:
            return new ValidationError(
                `Error de validación desconocido en ${firstError.path.join(".")}: ${
                    firstError.message
                }`
            );
    }
}

/**
 * @description Mapea un error crudo de PostgreSQL (pg) a una de las clases de errores personalizadas.
 * La lógica para extraer el campo y valor duplicados se mantiene.
 * @param error - El objeto de error de PostgreSQL (debe tener la propiedad 'code').
 * @param operation - Nombre de la operación de servicio que falló.
 * @returns Un error personalizado (DatabaseError, DuplicateError, etc.).
 */
export function mapDatabaseToCustomError(error: any, operation?: string): Error {
    switch (error.code) {
        case "23505": {
            // unique_violation
            // Extraer el campo duplicado del error de PostgreSQL
            let field = "campo";
            let value = "valor desconocido";
            let resource = "Recurso"; // Usar "User" si es solo para usuarios, o pasar como argumento

            if (error.detail) {
                const match = error.detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
                if (match) {
                    field = match[1].trim(); // Campo que causó la violación
                    value = match[2].trim(); // Valor duplicado
                }
            }

            // Intenta deducir el recurso de la restricción
            if (error.table) {
                resource = error.table.charAt(0).toUpperCase() + error.table.slice(1);
            }

            return new DuplicateError(resource, field, value);
        }

        case "23502": {
            // not_null_violation
            const missingColumn = error.column || "campo desconocido";
            return new PropertyRequiredError(missingColumn);
        }

        case "23503": {
            // foreign_key_violation
            return new ValidationError(
                `El registro relacionado no fue encontrado o está en uso: ${
                    error.detail || "clave foránea"
                }`
            );
        }

        case "42P01": // undefined_table
            return new DatabaseError(`Tabla inexistente: ${error.message}`, error.code, operation);

        case "42703": // undefined_column
            return new DatabaseError(
                `Columna inexistente: ${error.message}`,
                error.code,
                operation
            );

        case "08003": // connection_does_not_exist
        case "08006": // connection_failure
            return new DatabaseError("Error de conexión a la base de datos", error.code, operation);

        default:
            // Error de PostgreSQL no contemplado (ej: sintaxis, permisos, etc.)
            return new DatabaseError(
                `Fallo en la operación de base de datos: ${error.message}`,
                error.code,
                operation
            );
    }
}

/**
 * @description Función central para manejar cualquier error que venga de los servicios.
 * Mapea errores externos (Zod, BD) a errores personalizados, registra el log y relanza.
 * @param err - El error original (ZodError, PostgreSQL error, o Error genérico).
 * @param operation - La operación de servicio que falló (ej: "createUser").
 */
export function handlerServiceError(err: any, operation: string): never {
    const tracker = new OperationTracker(`[ERROR] ${operation} failed - Error handling`);
    let customError: Error;

    try {
        if (err instanceof z.ZodError) {
            customError = mapZodToCustomError(err);
        } else if (err.code && typeof err.code === "string" && err.severity) {
            customError = mapDatabaseToCustomError(err, operation);
        } else if (err instanceof ValidationError || err instanceof DatabaseError) {
            customError = err;
        } else {
            const errorMessage = err.message || err.toString();
            customError = new DatabaseError(
                `Unexpected error during ${operation}: ${errorMessage}`,
                undefined,
                operation
            );
        }
    } catch (mappingError: any) {
        customError = new DatabaseError(
            `Fallo al procesar el error: ${mappingError.message}`,
            "MapperFailed",
            operation
        );
    }
    tracker.error(customError);
    throw customError;
}
