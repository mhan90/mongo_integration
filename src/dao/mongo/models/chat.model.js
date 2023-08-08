import mongoose from "mongoose";

const schema = mongoose.Schema({
  user: String,
  message: String,
});

const ChatModel = mongoose.model("messages", schema);

export default ChatModel;
