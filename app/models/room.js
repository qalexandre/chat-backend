const mongoose = require("mongoose");

let roomSchema = new mongoose.Schema({
  title: String,
  img: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [
    {
      text: String,
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
      author: {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: String,
      },
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
