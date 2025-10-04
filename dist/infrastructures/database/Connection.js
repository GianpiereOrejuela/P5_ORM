import { Sequelize } from "sequelize";
import { dbConfig } from "../../config/database_config.js";
import { OperationTracker } from "../loggins/LoggerService.js";
import { handlerServiceError } from "../../domain/errors/Error.mapper.js";
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
    const tracker = new OperationTracker("[START] Conexión a la base de datos con Sequelize.");
    try {
        await sequelize.authenticate();
        tracker.info("[SUCCESS] Conexión a la base de datos establecida correctamente con Sequelize.");
        return sequelize;
    }
    catch (error) {
        tracker.error("[ERROR] Error al conectar a la base de datos:");
        handlerServiceError(error, "authenticateDatabase");
    }
}
authenticateDatabase();
//Disponibilidad de sequelize en otros archivos de mi proyecto
export { sequelize };
//# sourceMappingURL=Connection.js.map