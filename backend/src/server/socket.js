import { Server } from "socket.io";
import { groupsModel } from "../database/models/groups.js";
import { usersModel } from "../database/models/users.js";

const setupSocketServer = (server) => {
  const ioServer = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  ioServer.on("connection", async (socket) => {
    // Mandar todos los grupos creados
    ioServer.emit("groups", await groupsModel.find());

    // Crear nuevo grupo
    socket.on("createGroup", async (data) => {
      try {
        const newGroup = {
          messages: [],
          name: data.name,
          photo: data.photo,
          users: [{ user: data.idUser }],
        };
        const newGroupModel = await groupsModel.create(newGroup);
        const user = await usersModel.findById(data.idUser);
        if (newGroupModel && user) {
          user.groups.push({ group: newGroupModel._id });
          await user.save();
          ioServer.emit("groups", await groupsModel.find());
        }
      } catch (err) {
        console.error(err);
      }
    });

    // Eliminar un grupo
    socket.on("deleteGroup", async (data) => {
      try {
        await groupsModel.findByIdAndDelete(data.idGroup);
        ioServer.emit("groups", await groupsModel.find());
      } catch (err) {
        console.log(err);
      }
    });

    // Unirse a un grupo
    socket.on("joinGroup", async (data) => {
      try {
        const groupSelected = await groupsModel.findById(data.idGroup);
        const user = await usersModel.findById(data.idUser);
        if (groupSelected && user) {
          groupSelected.users.push({ user: data.idUser });
          user.groups.push({ group: data.idGroup });
          await groupSelected.save();
          await user.save();
          ioServer.emit("groups", await groupsModel.find());
        }
      } catch (err) {
        console.log(err);
      }
    });

    // Abandonar grupo
    socket.on("leaveGroup", async (data) => {
      try {
        const groupSelected = await groupsModel.findById(data.idGroup);
        const user = await usersModel.findById(data.idUser);
        if (groupSelected && user) {
          const indexUser = groupSelected.users.findIndex(
            (u) => u["user"] === data.idUser
          );
          groupSelected.users.splice(indexUser, 1);
          const indexGroup = user.groups.findIndex(
            (g) => g["group"] === data.idGroup
          );
          user.groups.splice(indexGroup, 1);
          await groupSelected.save();
          await user.save();
          ioServer.emit("groups", await groupsModel.find());
        }
      } catch (err) {
        console.log(err);
      }
    });

    // Recibir nuevo mensaje
    socket.on("newMessage", async (data) => {
      try {
        const groupSelected = await groupsModel.findById(data.idGroup);
        if (groupSelected) {
          groupSelected.messages.push({ data: data.data });
          await groupSelected.save();
          ioServer.emit("messages", groupSelected.messages);
          ioServer.emit("groups", await groupsModel.find());
        }
      } catch (err) {
        console.log(err);
      }
    });

    // Eliminar Mensaje
    socket.on("deleteMessage", async (data) => {
      try {
        const groupSelected = await groupsModel.findById(data.idGroup);
        if (groupSelected) {
          const indexMessage = groupSelected.messages.findIndex(message => String(message._id) === data.idMessage);
          groupSelected.messages.splice(indexMessage, 1);
          await groupSelected.save();
          ioServer.emit("messages", groupSelected.messages);
          ioServer.emit("groups", await groupsModel.find());
        }
      } catch (err) {
        console.error(err);
      }
    })
  });

  

  return ioServer;
};

export default setupSocketServer;
