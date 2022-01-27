const express = require("express");
const path = require("path");

const cors = require("cors");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

require("./config/database");

const {
  registerUser,
  editUser,
  getUser,
  loginUser,
} = require("./app/controller/users");
const {
  registerRoom,
  editRoom,
  addUserInRoom,
  removeUserInRoom,
  getRooms,
  getRoom,
} = require("./app/controller/rooms");
const {
  saveMessageRoom,
  saveMessageChat,
} = require("./app/controller/messages");
const { registerChat, getChats, getChat } = require("./app/controller/chats");

io.on("connection", (socket) => {
  socket.on("register", async ({ name, password }, callback) => {
    const user = await registerUser(name, password);
    if (!user) return callback({ error: "Error registering user" });
    callback(user);
  });
  socket.on("login", async ({ name, password }, callback) => {
    const user = await loginUser(name, password);

    if (!user) return callback({ error: "Error logging user" });
    callback(user);
  });
  socket.on("join", async (name, callback) => {
    const user = await getUser(name);
    const rooms = await getRooms(name);
    const chats = await getChats(name);
    var roomSelected;
    socket.on("refresh", async () => {
      const refreshedRooms = await getRooms(name);
      const refreshedChats = await getChats(name);
      socket.emit("getRooms", { user, rooms: refreshedRooms }, () => {});
      socket.emit("getChats", { chats: refreshedChats }, () => {});
    });
    socket.emit("getRooms", { user, rooms }, () => {});
    socket.on("getRoom", async ({ newRoom, lastRoom }, callback) => {
      const roomGetted = await getRoom(newRoom._id);
      if (lastRoom) socket.leave(lastRoom._id);
      roomSelected = newRoom._id;
      socket.join(newRoom._id);
      callback(roomGetted);
    });
    socket.emit("getChats", { chats }, () => {});
    socket.on("getChat", async ({ newChat, lastChat }, callback) => {
      const chatGetted = await getChat(newChat._id);
      if (lastChat) socket.leave(lastChat._id);
      roomSelected = newChat._id;
      socket.join(newChat._id);
      callback(chatGetted);
    });
    socket.on("createRoom", async ({ room }, callback) => {
      const roomCreated = await registerRoom(room, user._id);
      callback(roomCreated);
      //const room = registerRoom(roomName, user._id);
    });
    socket.on("createChat", async ({ chat }, callback) => {
      const chatCreated = await registerChat(chat, user._id);
      // callback(chatCreated);
      //const room = registerRoom(roomName, user._id);
    });
    socket.on("sendMessageRoom", async ({ room, message }, callback) => {
      const messageCreated = await saveMessageRoom(
        message,
        user._id,
        room.title
      );
      io.to(roomSelected).emit("message", {
        messageCreated,
      });
    });
    socket.on("sendMessageChat", async ({ chat, message }, callback) => {
      const messageCreated = await saveMessageChat(message, user._id, chat._id);
      io.to(roomSelected).emit("message", {
        messageCreated,
      });
    });
    socket.on("deleteMessageRoom", async ({ room, message }, callback) => {
      const messageDeleted = await messa;
    });
    socket.on("addUserRoom", async ({ room, name }, callback) => {
      const roomGetted = await addUserInRoom(room._id, name);
      callback(roomGetted);
    });
  });

  socket.on("disconnect", () => {
    /*  const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    } */
  });
});

app.use(router);
app.use(cors());

server.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
