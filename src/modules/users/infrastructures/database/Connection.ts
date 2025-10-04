import { Sequelize } from "sequelize";
import { dbConfig } from "../../../../shared/config/database_config.js";
import { OperationTracker } from "../../../../shared/infrastructures/loggins/LoggerService.js";
import { handlerServiceError } from "../../../../shared/domain/errors/Error.mapper.js";

// Inicializa Sequelize
const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASSWORD, {
    host: dbConfig.DB_HOST,
    port: dbConfig.DB_PORT,
    dialect: "postgres",
    pool: {
        max: 5, // Máximo de conexiones en el pool
        min: 0, // Mínimo de conexiones en el pool
        acquire: 30000,
        idle: 10000,
    },
    logging: false, // Desactiva la salida de SQL por defecto
});

// Función para probar la conexión
async function authenticateDatabase() {
    const tracker = new OperationTracker("Conexion a la base de datos con Sequelize.");
    try {
        await sequelize.authenticate();
        tracker.info("Conexion a la base de datos establecida correctamente con Sequelize.");
        return sequelize;
    } catch (error: any) {
        tracker.error(`Error al conectar a la base de datos: ${error.message || error}`);
        handlerServiceError(error, "authenticateDatabase");
    }
}

//Disponibilidad de sequelize en otros archivos de mi proyecto
export { sequelize };
export const dbConnection = authenticateDatabase();
