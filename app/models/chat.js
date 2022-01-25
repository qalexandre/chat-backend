const mongoose = require("mongoose");

let chatSchema = new mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  participants: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: String,
    },
  ],
  messages: [
    {
      text: String,
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Chat", chatSchema);
