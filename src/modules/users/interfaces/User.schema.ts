/**
 * @fileoverview Esquema de validación para la creación de usuarios.
 * @module schemas/userSchema
 */
import z from "zod";

/**
 * @description Validación de nombre.
 * @property {string} trim - El nombre no debe contener espacios al inicio o al final.
 * @property {string} min - El nombre debe tener al menos 3 caracteres.
 * @property {string} max - El nombre debe tener como máximo 255 caracteres.
 */
const nameValidation = z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .refine((name) => /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/.test(name), {
        message: "El nombre solo puede contener letras y espacios.",
    });

/**
 * @description Validación de correo electrónico.
 * @property {string} trim - El correo no debe contener espacios al inicio o al final.
 * @property {string} min - El correo debe tener como minimo 6 caracteres.
 * @property {string} max - El correo debe tener como maximo 255 caracteres.
 * @property {string} email - El correo debe ser válido.
 */
const emailValidation = z
    .string()
    .trim()
    .min(6, "El correo debe tener como minimo 6 caracteres.")
    .max(255, "El correo debe tener como maximo 255 caracteres.")
    .email("Correo electronico invalido.");

/**
 * @description Validación de contraseña.
 * @property {string} trim - La contraseña no debe contener espacios al inicio o al final.
 * @property {string} min - La contraseña debe tener al menos 8 caracteres.
 * @property {string} max - La contraseña debe tener como máximo 255 caracteres.
 * @property {string} refine - Debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.
 */
const passwordValidation = z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .refine((password) => /^(?=.*[A-Z])/.test(password), {
        message: "Debe incluir al menos una letra mayúscula.",
    })
    .refine((password) => /^(?=.*[a-z])/.test(password), {
        message: "Debe incluir al menos una letra minúscula.",
    })
    .refine((password) => /^(?=.*\d)/.test(password), {
        message: "Debe incluir al menos un número.",
    })
    .refine((password) => /^(?=.*[@$!%*?&])/.test(password), {
        message: "Debe incluir al menos un carácter especial.",
    });

/**
 * @description Esquema de validación para la creación de usuarios.
 * @property {string} name - Nombre del usuario.
 * @property {string} email - Correo electrónico del usuario.
 * @property {string} password - Contraseña del usuario.
 */
export const CreateUserSchema = z.object({
    id: z.number().optional(),
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
});

/**
 * @description Tipo inferido del esquema de validación para la creación de usuarios.
 */
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
