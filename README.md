# COMANDOS DE SEQUELIZE

### Inicializa el proyecto Node.js y configura TypeScript

-   npm init -y
-   npm install typescript ts-node @types/node --save-dev
-   npx tsc --init # Crea el archivo tsconfig.json

### Instala Express (para nuestra futura API) y dependencias auxiliares

-   npm install express dotenv
-   npm install @types/express --save-dev

### Instala Sequelize y el driver de PostgreSQL

-   npm install sequelize pg pg-hstore

# Realiza un test de conexión a la base de datos

-   npx ts-node src/db/connection.ts

### Instala CLI de Sequelize (verifica que tu archivo .sequelizerc exista y este bien configurado)

-   npm install sequelize-cli --save-dev

### Genera el archivo de migraciones

-   npx sequelize-cli migration:generate --name create-users-table

### Ejecuta la migración para crear la tabla de usuarios (se creara un archivo con la migración y un index.js en models)

-   npx sequelize-cli db:migrate

### Consulta el resultado en tu psql con docker

-   docker exec -it P5-PROJECT psql -U <TU_USUARIO> -d <TU_NOMBRE_DB>

---

# TERMINOS CLAVE

-   Migracion: Archivo que contiene las instrucciones para crear o modificar una tabla en la base de datos.
-   Modelo: Archivo que define la estructura y las relaciones de una tabla en la base de datos.
-   infraestructura: Carpeta que contiene los archivos de configuración y la conexión a la base de datos.
-   domian: Carpeta que contiene los archivos que definen la lógica de negocio de la aplicación.
-   interface: Carpeta que contiene los archivos que definen las interfaces de la aplicación.
-   config: Carpeta que contiene los archivos de configuración de la aplicación.
