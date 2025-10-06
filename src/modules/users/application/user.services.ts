import { Users } from "../infrastructures/database/models/User.models.js";
import { OperationTracker } from "../../../shared/infrastructures/loggins/LoggerService.js";
import { handlerServiceError } from "../../../shared/domain/errors/Error.mapper.js";
import { CreateUserSchema } from "../interfaces/User.schema.js";
import bcrypt from "bcrypt";
import type { UserCreationAttributes } from "../infrastructures/database/models/User.models.js";

//Tipado para la data de actualizacion
type UserUpdateAttributes = Partial<UserCreationAttributes>;

/**
 * Servicio para la gestión de usuarios
 */
export class UserService {
    constructor() {
        // ✅ Mover el tracker fuera del constructor o hacerlo estático
        const tracker = new OperationTracker("UserService - Initialization");
        tracker.info("UserService initialized successfully");
    }

    /**
     * Crea un nuevo usuario en la base de datos
     * @param data - Datos del usuario a crear
     * @returns El usuario creado sin la contraseña
     */
    public async createUser(data: UserCreationAttributes): Promise<Users> {
        const tracker = new OperationTracker("UserService.createUser");
        try {
            tracker.info(`[INFO] createUser - Input validation started`);
            const safeParse = CreateUserSchema.safeParse(data);
            if (!safeParse.success) {
                tracker.error(`createUser - Input validation failed: ${safeParse.error.message}`);
                handlerServiceError(
                    safeParse.error, // ✅ Pasar el objeto ZodError completo
                    "createUser - Input validation failed"
                );
            }
            tracker.info(`createUser - Database query started`);
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const userData = { ...data, password: hashedPassword };
            const newUser = await Users.create(userData); // Crear el usuario en la base de datos
            tracker.info(`createUser - Database query finished`);
            const { password: _, ...userWithoutPassword } = newUser.toJSON(); // Eliminar la contraseña del objeto
            return userWithoutPassword as Users;
        } catch (err: any) {
            tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err, "createUser - Database query failed"); // ✅ Pasar el objeto completo, no solo el mensaje
        }
    }

    /**
     * Obtiene una lista paginada de usuarios
     * @param limit - Número máximo de usuarios a devolver (default: 10)
     * @param offset - Desplazamiento para la paginación (default: 0)
     * @returns Un objeto con los usuarios y el total de registros
     */
    public async findUsers(
        limit: number = 10,
        offset: number = 0
    ): Promise<{ rows: Users[]; count: number }> {
        const tracker = new OperationTracker("UserService.findUsers");
        try {
            tracker.info(`findUsers - Database query started`);
            const result = await Users.findAndCountAll({
                attributes: ["id", "name", "email", "createdAt"],
                limit: limit,
                offset: offset,
                order: [["id", "ASC"]],
            });
            tracker.info(`findUsers - Database query finished`);
            return result;
        } catch (err: any) {
            tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err, "findUsers - Database query failed"); // ✅ Pasar objeto completo
        }
    }

    /**
     * Obtiene un usuario por su ID
     * @param id - ID del usuario a buscar
     * @returns El usuario encontrado o null si no existe
     */
    public async findByID(id: number): Promise<Users | null> {
        const tracker = new OperationTracker("UserService.findByID");
        try {
            tracker.info(`findByID - Database query started`);
            const result = await Users.findByPk(id, {
                attributes: ["id", "name", "email", "createdAt"],
            });
            tracker.info(`findByID - Database query finished`);
            return result;
        } catch (err: any) {
            tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err, "findByID - Database query failed"); // ✅ Pasar objeto completo
        }
    }

    /**
     * Actualiza un usuario por su ID
     * @param id - ID del usuario a actualizar
     * @param data - Datos a actualizar
     * @returns Un array con el número de registros afectados y los registros actualizados
     */
    public async updateUsers(id: number, data: UserUpdateAttributes): Promise<[number, Users[]]> {
        const tracker = new OperationTracker("UserService.updateUsers");
        try {
            tracker.info(`updateUsers - Database query started`);
            const [affectedCount, affectedRows] = await Users.update(data, {
                where: { id },
                returning: true, //Devuleve los registros actualizados solo para postgresql
            });
            tracker.info(`update - Database query finished`);
            return [affectedCount, affectedRows];
        } catch (err: any) {
            tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err, "updateUsers - Database query failed"); // ✅ Pasar objeto completo
        }
    }

    /**
     * Elimina un usuario por su ID
     * @param id - ID del usuario a eliminar
     * @returns El número de registros eliminados
     */
    public async deleteUsers(id: number): Promise<number> {
        const tracker = new OperationTracker("UserService.deleteUsers");
        try {
            tracker.info(`deleteUsers - Database query started`);
            const affectedCount = await Users.destroy({
                where: { id },
            });
            tracker.info(`deleteUsers - Database query finished`);
            return affectedCount;
        } catch (err: any) {
            tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err, "deleteUsers - Database query failed"); // ✅ Pasar objeto completo
        }
    }
}

//Singleton
export const userService = new UserService();
