import { DataTypes, Model } from "sequelize";
import { sequelize } from "../Connection.js";
import type { Optional } from "sequelize";
import type { CreateUserSchemaType } from "../../../interfaces/User.schema.js";

// Definir Atributos de Creación (para el método .create())
export interface UserCreationAttributes extends Optional<CreateUserSchemaType, "id"> {}

//Extender la clase Sequelize Model
export class Users
    extends Model<CreateUserSchemaType, UserCreationAttributes>
    implements CreateUserSchemaType
{
    // Aseguramos que los atributos estén disponibles como propiedades de instancia
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

//Inicializar y Definir el Modelo
Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize, // La instancia de conexión
        tableName: "users", // Nombre de la tabla
        modelName: "Users", // Nombre del Modelo
        timestamps: true, // Deja que Sequelize maneje createdAt y updatedAt
    }
);
