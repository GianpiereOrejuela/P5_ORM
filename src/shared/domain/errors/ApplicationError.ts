/**
 * @description Error base para validaciones
 */
export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}

/**
 * @description Error para propiedades requeridas (Zod + PostgreSQL)
 */
export class PropertyRequiredError extends ValidationError {
    public readonly property: string;
    constructor(property: string) {
        super(`${property} is required.`);
        this.name = "PropertyRequiredError";
        this.property = property;
    }
}

/**
 * @description Error para duplicados en BD (PostgreSQL 23505)
 */
export class DuplicateError extends Error {
    public readonly field: string;
    public readonly value: string;
    public readonly httpCode: number = 409; // Conflict

    constructor(resource: string, field: string, value: string) {
        super(`${resource} with ${field} '${value}' already exists.`);
        this.name = "DuplicateError";
        this.field = field;
        this.value = value;
    }
}

/**
 * @description Error genérico de base de datos (mejorado)
 */
export class DatabaseError extends Error {
    public readonly code?: string;
    public readonly operation?: string;
    public readonly httpCode: number = 500; // Internal Server Error

    constructor(message: string, code?: any, operation?: any) {
        super(message);
        this.name = "DatabaseError";
        this.code = code;
        this.operation = operation;
    }
}
