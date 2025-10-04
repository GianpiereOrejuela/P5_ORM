import * as dotenv from "dotenv";
dotenv.config(); // Carga las variables del archivo .env

interface DBConfig {
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
}

const loadDbConfig = (): DBConfig => {
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
