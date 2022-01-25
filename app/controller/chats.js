const Chat = require("../models/chat");
const User = require("../models/user");

const registerChat = async (name, userId2) => {
  let user1 = await User.findOne({ name });
  let user2 = await User.findById(userId2);

  if (!user1) return { error: "User not find" };

  const chat = new Chat({
    participants: [
      { userId: user1._id, name: user1.name },
      { userId: user2._id, name: user2.name },
    ],
  });
  try {
    await chat.save();
    return chat;
  } catch (error) {
    return { error: "Error registering new chat" };
  }
};

const getChats = async (name) => {
  try {
    let user = await User.findOne(name);
    if (user) {
      let chat = await Chat.find({
        participants: { $elemMatch: { userId: user._id } },
      });
      return chat;
    } else {
      return { error: "User not find" };
    }
  } catch (error) {
    return false;
  }
};

module.exports = { registerChat, getChats };
