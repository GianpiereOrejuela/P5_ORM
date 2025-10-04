import { userService } from "./modules/users/application/user.services.js";
import { OperationTracker } from "./shared/infrastructures/loggins/LoggerService.js";
import { handlerServiceError } from "./shared/domain/errors/Error.mapper.js";

const userData = {
    name: "Alice Smith",
    email: "alice.s@example.com",
    password: "securePassword@123",
};

async function main() {
    const tracker = new OperationTracker("Creacion de un usuario.");
    try {
        //Creacion de nuevo usuario
        const user = await userService.createUser(userData);
        tracker.info("Usuario creado exitosamente.");
        console.log(user);
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // //Lectura del usuario creado
        // const id = user.id;
        // const readUser = await userService.findByID(id);
        // tracker.info("Usuario leído exitosamente.");
        // console.log(readUser);
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        // //Actualizar datos
        // const updateData = {
        //     name: "Alice Johnson",
        //     email: "alice.j@example.com",
        // };
        // const [count] = await userService.updateUsers(id, updateData);
        // tracker.info("Usuario actualizado exitosamente.");
        // console.log(`Se actualizaron ${count} usuarios.`);
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        // //Lectura de datos actualizados
        // const updatedReadUser = await userService.findUsers();
        // tracker.info("Usuario leído exitosamente.");
        // console.log(updatedReadUser);
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        // //Delete users
        // const deleteCount = await userService.deleteUsers(id);
        // tracker.info("Usuario eliminado exitosamente.");
        // console.log(`Se eliminaron ${deleteCount} usuarios.`);
        // await new Promise((resolve) => setTimeout(resolve, 3000));

        // //Lectura de usuarios después de la eliminación
        // const readAfterDelete = await userService.findUsers();
        // tracker.info("Usuario leido exitosamente.");
        // console.log(readAfterDelete);
    } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        tracker.error("Error al crear el usuario:");
        handlerServiceError(error, "main - Error al crear el usuario");
    }
}

main();
