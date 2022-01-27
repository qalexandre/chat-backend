const { isValidObjectId } = require("mongoose");
const Room = require("../models/room");
const User = require("../models/user");

const registerRoom = async (title, userId) => {
  const room = new Room({
    title: title,
    author: userId,
    participants: [userId],
  });
  try {
    await room.save();
    return room;
  } catch (error) {
    return { error: "Error registering new room" };
  }
};

const editRoom = async (id, title) => {
  try {
    let room = await Room.findOneAndUpdate(
      id,
      { $set: { title: title } },
      { upsert: true, new: true }
    );
    return room;
  } catch (error) {
    return { error: "Error editing room" };
  }
};

const addUserInRoom = async (id, name) => {
  try {
    let user = await User.findOne({ name });

    let room = await Room.findOneAndUpdate(
      { _id: id },
      {
        $push: { participants: user._id },
      },
      { upsert: true, new: true }
    );
    return room;
  } catch (error) {
    return { error: error };
  }
};

const removeUserInRoom = async (id, userId) => {
  try {
    let userInRoom = await Room.find({ participants: [userId] });
    if (!userInRoom === []) return { error: "User hasn't in room" };
    let room = await Room.findOneAndUpdate(id, {
      $pull: { participants: userId },
    });
    await room.save();
    return room;
  } catch (error) {
    return { error: "Error removing user in room" };
  }
};

const getRooms = async (name) => {
  try {
    let user = await User.findOne(name);
    if (user) {
      let room = await Room.find({ participants: user._id });
      return room;
    } else {
      return { error: "User not find" };
    }
  } catch (error) {
    return false;
  }
};

const getRoom = async (id) => {
  try {
    let room = await Room.findById(id);
    return room;
  } catch (error) {
    return { error: "Room not find" };
  }
};

module.exports = {
  registerRoom,
  editRoom,
  addUserInRoom,
  removeUserInRoom,
  getRooms,
  getRoom,
};
