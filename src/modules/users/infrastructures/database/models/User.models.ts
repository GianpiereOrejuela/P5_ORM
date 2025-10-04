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
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
            unique: true,
        },
    },
    {
        sequelize, // La instancia de conexión
        tableName: "users", // Nombre de la tabla
        modelName: "Users", // Nombre del Modelo
        timestamps: true, // Deja que Sequelize maneje createdAt y updatedAt
    }
);
