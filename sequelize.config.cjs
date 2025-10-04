const { dbConfig } = require("./dist/config/database_config"); // Importa la config real transpilada

// Exporta la configuración en el formato de Sequelize CLI
module.exports = {
    development: {
        username: dbConfig.DB_USER,
        password: dbConfig.DB_PASSWORD,
        database: dbConfig.DB_NAME,
        host: dbConfig.DB_HOST,
        port: dbConfig.DB_PORT,
        dialect: "postgres",
        logging: true,
    },
    // Agrega test y production si son necesarios
};
