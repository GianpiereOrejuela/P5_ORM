import * as crypto from "crypto";
import { logger } from "./PinoLogger.adapter.js";

/**
 * @description Encapsula el contexto de una operación (ID y tiempo) para simplificar el logging.
 */
export class OperationTracker {
    public readonly operationID: string;
    private readonly startTime: number;
    private readonly operation: string;

    /**
     * @param {string} operation - El nombre de la operación que se está rastreando (ej: "createUser").
     */
    constructor(operation: string) {
        this.operation = operation;
        this.operationID = crypto.randomUUID();
        this.startTime = Date.now();
        this.info(`[START] ${operation} started`);
    }

    /**
     * @description Llama a la función logInfo con el operationID y el operation predefinidos.
     * @param {string} message - El mensaje del log.
     */
    public info(message: string) {
        // La duración solo se calcula si es un log de ÉXITO/FIN
        const duration = message.includes("[SUCCESS]") ? Date.now() - this.startTime : 0;

        logInfo(message, this.operation, this.operationID, duration);
    }

    /**
     * @description Llama a la función logError con el operationID, el operation y la duración.
     * @param {Error | any} error - El objeto de error.
     */
    public error(error: any) {
        const duration = Date.now() - this.startTime;
        logError(error, this.operation, this.operationID, duration);
    }
}

/**
 * @description Estructura base para todos los logs de información y éxito.
 * @param {string} message - El mensaje principal del log (ej: "[START] User creation").
 * @param {string} operation - Nombre de la operación/función (ej: "createUser").
 * @param {string} operationID - ID único para el rastreo del request.
 * @param {number} [duration=0] - Duración de la operación en milisegundos (para logs de éxito/finalización).
 */
export function logInfo(
    message: string,
    operation: string,
    operationID: string,
    duration: number = 0
) {
    const logObject: any = {
        message,
        operation,
        operationID,
    };

    if (duration > 0) {
        logObject.performance = {
            duration: `${duration}ms`,
            fast: duration < 100,
        };
    }

    logger.info(logObject);
}

/**
 * @description Estructura base para todos los logs de error, incluyendo detalles de DB o Zod.
 * @param {Error | any} error - El objeto de error original.
 * @param {string} operation - Nombre de la operación/función que falló.
 * @param {string} operationID - ID único para el rastreo del request.
 * @param {number} [duration=0] - Duración de la operación en milisegundos (para performance).
 */
export function logError(error: any, operation: string, operationID: string, duration: number = 0) {
    const logObject: any = {
        message: `[ERROR] ${operation} failed: ${error.message || "Unknown error"}`,
        operation,
        operationID,
        errorType: error.name || "GenericError",
        errorMessage: error.message || "No message available",
    };

    if (error.code && error.table) {
        logObject.database = {
            code: error.code,
            constraint: error.constraint,
            table: error.table,
            column: error.column,
            detail: error.detail,
        };
        logObject.message = `PostgreSQL error occurred on ${operation}`;
        logObject.errorType = "PostgreSQLError";
    }

    if (error.issues && Array.isArray(error.issues)) {
        const firstIssue = error.issues[0];
        logObject.validation = {
            zodCode: firstIssue.code,
            path: firstIssue.path.join("."),
            zodMessage: firstIssue.message,
            fullIssues: error.issues.map((i: any) => ({
                code: i.code,
                path: i.path.join("."),
                message: i.message,
            })),
        };
        logObject.message = `[ERROR] ${operation} failed - Zod Validation Error`;
        logObject.errorType = "ZodValidationError";
    }

    if (duration > 0) {
        logObject.performance = {
            duration: `${duration}ms`,
            fast: duration < 100,
        };
    }

    logger.error(logObject);
}
