import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();
// Inicializa Sequelize
const sequelize = new Sequelize(process.env.DB_NAME || "P5-DB", process.env.DB_USER || "GOrejuelaLluncor", process.env.DB_PASSWORD || "Lugi@103713", {
    host: process.env.DB_HOST || "localhost",
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
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión a la base de datos establecida correctamente con Sequelize.");
        return sequelize;
    }
    catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
        process.exit(1); // Sale del proceso si falla la conexión
    }
}
authenticateDatabase();
//Disponibilidad de sequelize en otros archivos de mi proyecto
export { sequelize };
//# sourceMappingURL=database.js.map