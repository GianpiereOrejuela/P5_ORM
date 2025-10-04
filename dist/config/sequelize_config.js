const dotenv = require("dotenv");
dotenv.config(); // Carga las variables del archivo .env
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error("[ERROR] Faltan una o mas variables de entorno críticas de la DB.");
}
module.exports = {
    development: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        port: parseInt(DB_PORT, 10),
        dialect: "postgres",
        logging: console.log, // Enable SQL logging
    },
    test: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: `${DB_NAME}_test`,
        host: DB_HOST,
        port: parseInt(DB_PORT, 10),
        dialect: "postgres",
        logging: false, // Disable logging in test environment
    },
    production: {
        username: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        host: DB_HOST,
        port: parseInt(DB_PORT, 10),
        dialect: "postgres",
        logging: false, // Disable logging in production
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};
export {};
//# sourceMappingURL=sequelize_config.js.map