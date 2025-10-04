import pino from "pino";
/**
 * @description Configuración del logger para la aplicación.
 */
export const logger = pino({
    name: "ORM Project", // Nombre de la aplicación en los logs
    level: "info", // Nivel mínimo a mostrar: info, warn, error
    transport: {
        target: "pino-pretty", // Formateo bonito para desarrollo
        options: {
            colorize: true, // Colores en consola
            translateTime: "SYS:standard", // Formato fecha: "2025-01-15 10:30:15"
            ignore: "pid,hostname", // Ocultar info innecesaria en desarrollo
        },
    },
    // Información base que aparece en todos los logs
    base: {
        env: process.env.NODE_ENV || "development", // Entorno actual
    },
    // Manejo de errores con stack trace
    serializers: {
        err: pino.stdSerializers.err, // Formateo estándar de errores
        error: pino.stdSerializers.err, // Alias para errores
    },
});
//# sourceMappingURL=PinoLogger.adapter.js.map