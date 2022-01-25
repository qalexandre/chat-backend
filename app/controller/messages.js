const Chat = require("../models/chat");
const Room = require("../models/room");
const User = require("../models/user");

const saveMessageRoom = async (message, userId, title) => {
  let user = await User.findById(userId);
  if (!user) return { error: "User not find" };
  try {
    let room = await Room.findOneAndUpdate(
      { title },
      {
        $push: {
          messages: {
            text: message,
            author: { userId: user._id, name: user.name },
          },
        },
      },
      { upsert: true, new: true }
    );
    return room;
  } catch (error) {
    return { error: "Room not find" };
  }
};

const saveMessageChat = async (message, userId, chatId) => {
  let user = await User.findById(userId);
  if (!user) return { error: "User not find" };
  try {
    let chat = await Chat.findOneAndUpdate(
      chatId,
      { $push: { messages: { text: message, author: userId } } },
      { upsert: true, new: true }
    );
    return chat;
  } catch (error) {
    return { error: "Chat not find" };
  }
};

module.exports = { saveMessageRoom, saveMessageChat };
