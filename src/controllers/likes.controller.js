import Campaign from "../models/campaign.model.js";
import Likes from "../models/likes.model.js";

const likeACampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { userId } = req.user._id;

  const like = await Likes.create({
    likedBy: userId,
    likedTo: campaignId,
  });

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res.status(404).json({
      status: 404,
      message: "Campaign not found",
    });
  }

  campaign.likes.push(userId);
  campaign.save();

  await Campaign.findByIdAndUpdate(campaignId, {
    $push: { likes: like._id },
  });

  return res.status(200).json({
    status: 200,
    like,
    message: "Campaign liked successfully",
  });
};

const unlikeACampaign = async (req, res) => {
  const { campaignId } = req.params;
  const { userId } = req.user._id;

  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res.status(404).json({
      status: 404,
      message: "Campaign not found",
    });
  }

  const like = await Likes.findOne({
    likedBy: userId,
    likedTo: campaignId,
  });

  if (!like) {
    return res.status(404).json({
      status: 404,
      message: "Like not found",
    });
  }

  campaign.likes = campaign.likes.filter((like) => like !== like._id);
  campaign.save();

  return res.status(200).json({
    status: 200,
    message: "Like removed successfully",
  });
};

//Use mongodb aggregation to get all of the likes for a campaign only using Campaign schema
const getLikesForACampaign = async (req, res) => {
  const { campaignId } = req.params;
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) {
    return res.status(404).json({
      status: 404,
      message: "Campaign not found",
    });
  }
  const likes = await Likes.aggregate([
    {
      $match: {
        likedTo: campaignId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "likedBy",
        foreignField: "_id",
        as: "likedBy",
      },
    },
    {
      $unwind: "$likedBy",
    },
  ]);

  return res.status(200).json({
    status: 200,
    likes,
    message: "Likes fetched successfully",
  });
};

export { likeACampaign, unlikeACampaign, getLikesForACampaign };
