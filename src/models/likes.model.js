import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
});

const Likes = mongoose.model("Likes", likeSchema);

export default Likes;
