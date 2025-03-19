import mongoose from "mongoose";

const repliesSchema = new mongoose.Schema({
  reply: {
    type: String,
    required: true,
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comments",
    required: true,
  },
  replyBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  commentTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
  ],
  commentBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [repliesSchema],
});

const Comments = mongoose.model("Comments", commentSchema);

export default Comments;
