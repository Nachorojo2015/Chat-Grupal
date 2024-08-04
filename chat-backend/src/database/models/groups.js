import mongoose from "mongoose";

const groupsSchema = new mongoose.Schema({
  messages: [
    {
      data: {
        photo: {
          type: String,
        },
        name: {
          type: String,
        },
        time: {
          type: String,
        },
        typeMessage: {
          type: String,
        },
        value: {
          type: String,
        },
      },
    },
  ],
  name: {
    type: String,
  },
  photo: {
    type: String,
  },
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});

export const groupsModel = mongoose.model("Groups", groupsSchema);
