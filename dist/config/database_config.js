import * as dotenv from "dotenv";
dotenv.config(); // Carga las variables del archivo .env
const loadDbConfig = () => {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
        throw new Error("[ERROR] Faltan una o mas variables de entorno críticas de la DB.");
    }
    return {
        DB_HOST,
        DB_PORT: parseInt(DB_PORT, 10),
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
    };
};
export const dbConfig = loadDbConfig();
//# sourceMappingURL=database_config.js.map