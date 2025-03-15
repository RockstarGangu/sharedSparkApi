import Campaign from "../models/campaign.model.js";
import Comments from "../models/comments.model.js";
import { ApiError } from "../utils/apiError.js";

const commentOnACampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { userId } = req.user._id;
  const { commentText } = req.body;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res.status(404).json({
      status: 404,
      message: "Campaign not found",
    });
  }

  const comment = await Comments.create({
    comment: commentText,
    commentedBy: userId,
    commentedTo: campaignId,
  });

  campaign.comments.push(comment._id);
  campaign.save();

  return res.status(200).json({
    status: 200,
    message: "Comment added successfully",
  });
};

const unCommentOnACampaign = async (req, res) => {
  const { commentId } = req.params;

  await Comments.findByIdAndDelete(commentId);

  return res.status(200).json({
    status: 200,
    message: "Comment removed successfully",
  });
};

const getCommentsForACampaign = async (req, res) => {
  const { campaignId } = req.params;
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res
      .status(404)
      .json(
        new ApiError(404, "Campaign not found", "Campaign not found", "MISC")
      );
  }
  const comments = await Comments.aggregate([
    {
      $match: {
        commentedTo: campaignId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "commentedBy",
        foreignField: "_id",
        as: "commentedBy",
      },
    },
    {
      $unwind: "$commentedBy",
    },
  ]);

  return res.status(200).json({
    status: 200,
    comments,
    message: "Comments fetched successfully",
  });
};

const replyToAComment = async (req, res) => {
  const user = req.user._id;
  const commentId = req.params.commentId;
  const replyText = req.body.replyText;

  const comment = await Comments.findById(commentId);
  if (!comment) {
    return res.status(404).json({
      status: 404,
      message: "Comment not found",
    });
  }

  const reply = await Comments.create({
    comment: replyText,
    commentedBy: user,
    commentedTo: comment.commentedTo,
  });

  comment.replies.push(reply._id);
  comment.save();

  return res.status(200).json({
    status: 200,
    message: "Reply added successfully",
  });
};

const getRepliesForAComment = async (req, res) => {
  const commentId = req.params.commentId;
  const comment = await Comments.findById(commentId);
  if (!comment) {
    return res.status(404).json({
      status: 404,
      message: "Comment not found",
    });
  }
  const replies = await Comments.aggregate([
    {
      $match: {
        commentedTo: commentId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "commentedBy",
        foreignField: "_id",
        as: "commentedBy",
      },
    },
    {
      $unwind: "$commentedBy",
    },
  ]);

  return res.status(200).json({
    status: 200,
    replies,
    message: "Replies fetched successfully",
  });
};

export {
  commentOnACampaign,
  unCommentOnACampaign,
  getCommentsForACampaign,
  replyToAComment,
  getRepliesForAComment,
};
