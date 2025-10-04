/**
 * @description Error base para validaciones
 */
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
/**
 * @description Error para propiedades requeridas (Zod + PostgreSQL)
 */
export class PropertyRequiredError extends ValidationError {
    property;
    constructor(property) {
        super(`${property} is required.`);
        this.name = "PropertyRequiredError";
        this.property = property;
    }
}
/**
 * @description Error para duplicados en BD (PostgreSQL 23505)
 */
export class DuplicateError extends Error {
    field;
    value;
    httpCode = 409; // Conflict
    constructor(resource, field, value) {
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
    code;
    operation;
    httpCode = 500; // Internal Server Error
    constructor(message, code, operation) {
        super(message);
        this.name = "DatabaseError";
        this.code = code;
        this.operation = operation;
    }
}
//# sourceMappingURL=ApplicationError.js.map