const User = require("../models/user");

const registerUser = async (name, password) => {
  const user = new User({ name, password });
  try {
    await user.save();
    return user;
  } catch (error) {
    return false;
  }
};

const editUser = async (id, name, email, password) => {
  let user = await User.findById(id);
  user.isCorrectPassword(password, async function (err, same) {
    if (!same) return { error: "Incorrect password" };
    else {
      let user = await User.findOneAndUpdate(
        id,
        { $set: { name: name, email: email } },
        { upsert: true, new: true }
      );
      return user;
    }
  });
};

const loginUser = async (name, password) => {
  let user = await User.findOne({ name, password });
  if (!user) return { error: "USer not find" };
  return user;
};

const getUser = async (name) => {
  let user = await User.findOne(name);
  if (!user) return { error: "USer not find" };
  return user;
};

module.exports = { registerUser, editUser, getUser, loginUser };
