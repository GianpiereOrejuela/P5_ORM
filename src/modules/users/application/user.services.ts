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
    private readonly tracker = new OperationTracker(
        "UserService -  Database connection established"
    );

    /**
     * Crea un nuevo usuario en la base de datos
     * @param data - Datos del usuario a crear
     * @returns El usuario creado sin la contraseña
     */
    public async createUser(data: UserCreationAttributes): Promise<Users> {
        try {
            this.tracker.info(`[INFO] createUser - Input validation started`);
            const safeParse = CreateUserSchema.safeParse(data);
            if (!safeParse.success) {
                this.tracker.error(
                    `createUser - Input validation failed: ${safeParse.error.message}`
                );
                handlerServiceError(
                    safeParse.error.message,
                    "createUser - Input validation failed"
                );
            }
            this.tracker.info(`createUser - Database query started`);
            const hashedPassword = await bcrypt.hash(data.password, 10);
            const userData = { ...data, password: hashedPassword };
            const newUser = await Users.create(userData); // Crear el usuario en la base de datos
            this.tracker.info(`createUser - Database query finished`);
            const { password: _, ...userWithoutPassword } = newUser.toJSON(); // Eliminar la contraseña del objeto
            return userWithoutPassword as Users;
        } catch (err: any) {
            this.tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err.message, "createUser - Database query failed");
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
        try {
            this.tracker.info(`findUsers - Database query started`);
            const result = await Users.findAndCountAll({
                attributes: ["id", "name", "email", "createdAt"],
                limit: limit,
                offset: offset,
                order: [["id", "ASC"]],
            });
            this.tracker.info(`findUsers - Database query finished`);
            return result;
        } catch (err: any) {
            this.tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err.message, "findUsers - Database query failed");
        }
    }

    /**
     * Obtiene un usuario por su ID
     * @param id - ID del usuario a buscar
     * @returns El usuario encontrado o null si no existe
     */
    public async findByID(id: number): Promise<Users | null> {
        try {
            this.tracker.info(`findByID - Database query started`);
            const result = await Users.findByPk(id, {
                attributes: ["id", "name", "email", "createdAt"],
            });
            this.tracker.info(`findByID - Database query finished`);
            return result;
        } catch (err: any) {
            this.tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err.message, "findByID - Database query failed");
        }
    }

    /**
     * Actualiza un usuario por su ID
     * @param id - ID del usuario a actualizar
     * @param data - Datos a actualizar
     * @returns Un array con el número de registros afectados y los registros actualizados
     */
    public async updateUsers(id: number, data: UserUpdateAttributes): Promise<[number, Users[]]> {
        try {
            this.tracker.info(`updateUsers - Database query started`);
            const [affectedCount, affectedRows] = await Users.update(data, {
                where: { id },
                returning: true, //Devuleve los registros actualizados solo para postgresql
            });
            this.tracker.info(`update - Database query finished`);
            return [affectedCount, affectedRows];
        } catch (err: any) {
            this.tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err.message, "update - Database query failed");
        }
    }

    /**
     * Elimina un usuario por su ID
     * @param id - ID del usuario a eliminar
     * @returns El número de registros eliminados
     */
    public async deleteUsers(id: number): Promise<number> {
        try {
            this.tracker.info(`deleteUsers - Database query started`);
            const affectedCount = await Users.destroy({
                where: { id },
            });
            this.tracker.info(`deleteUsers - Database query finished`);
            return affectedCount;
        } catch (err: any) {
            this.tracker.error({
                message: err.message,
                name: err.name,
            });
            handlerServiceError(err.message, "deleteUsers - Database query failed");
        }
    }
}

//Singleton
export const userService = new UserService();
