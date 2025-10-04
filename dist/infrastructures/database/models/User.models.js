import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../infrastructures/database/Connection.js";
import { CreateUserSchema } from "../../../interfaces/dtos/User.schema.js";
import { OperationTracker } from "../../../infrastructures/loggins/LoggerService.js";
//Extender la clase Sequelize Model
export class Users extends Model {
    // Aseguramos que los atributos estén disponibles como propiedades de instancia
    id;
    name;
    email;
    password;
    createdAt;
    updatedAt;
}
//Inicializar y Definir el Modelo
Users.init({
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
}, {
    sequelize, // La instancia de conexión
    tableName: "users", // Nombre de la tabla
    modelName: "Users", // Nombre del Modelo
    timestamps: true, // Deja que Sequelize maneje createdAt y updatedAt
});
//# sourceMappingURL=User.models.js.map