import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  groups: [
    {
      group: {
        type: mongoose.Schema.Types.ObjectId,
      }
    },
  ],
  time: {
    type: String,
    default: new Date(),
  },
  thumbnail: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },
});

export const usersModel = mongoose.model("Users", messagesSchema);
