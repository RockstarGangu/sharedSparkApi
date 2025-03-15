import Campaign from "../models/campaign.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { campaignSchema } from "../zodSchema/campaign.schema.js";
import Adress from "../models/adress.model.js";
import Likes from "../models/likes.model.js";
import Comments from "../models/comments.model.js";

const listACampaign = asyncHandler(async (req, res) => {
  try {
    const campaignDetails = await req.body;
    if (Object.keys(campaignDetails).length === 0) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "INPUT DATA",
            "Provide campaign details",
            "Invalid/Empty credentials",
            "CHECK CREDENTIALS",
            "/list"
          )
        );
    }
    const result = campaignSchema.safeParse(campaignDetails);
    if (result.success) {
      const existedCampaign = await Campaign.findOne({
        validationProofNumber: result.data.validationProofNumber,
      });
      if (existedCampaign) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "Campaign already exists",
              "Campaign already exists",
              "DATABASE"
            )
          );
      }
      const campaign = await Campaign.create(result.data);
      console.log("I ran");
      const host = await req.user._id;
      const addedCampaign = await Campaign.findById(campaign._id);
      if (!addedCampaign) {
        return res
          .status(500)
          .json(
            new ApiError(
              500,
              "INTERNAL SERVER ERROR",
              "Something went wrong",
              "Internal Server Error",
              "Please check the status of the server and Database",
              "/list"
            )
          );
      }
      addedCampaign.host = host;
      await addedCampaign.save();
      return res
        .status(201)
        .json(
          new ApiResponse(200, addedCampaign, "Campaign created successfully")
        );
    } else if (result.error) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "DATA VALIDATION FAILED",
            result.error.flatten().fieldErrors,
            "VALIDATION"
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "INTERNAL SERVER ERROR", error, "INTERNAL"));
  }
});

const addMembersToACampaign = asyncHandler(async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const members = req.body;
    if (Object.keys(members).length === 0) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "INPUT DATA",
            "Provide members details",
            "Invalid/Empty credentials",
            "CHECK CREDENTIALS",
            "/addMembersToACampaign"
          )
        );
    }
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return new ApiError(
        404,
        "INPUT VALIDATION",
        "Campaign not found",
        "Campaign not found",
        "Please check your authentication status",
        "/addMembersToACampaign"
      );
    }
    if (campaign.host === req.user._id) {
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        members,
        { new: true }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(200, updatedCampaign, "Members added to the campaign")
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "INTERNAL SERVER ERROR", error, "INTERNAL"));
  }
});

//TODO: Only fetch nearby campaigns to the user's location
const getAllCampaigns = asyncHandler(async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      status: "Active",
      location: {
        $geoWithin: {
          $centerSphere: [[req.query.longitude, req.query.latitude], 5000],
        },
      },
    }).exec();
    return res
      .status(200)
      .json(new ApiResponse(200, campaigns, "Campaigns fetched successfully"));
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

const getCampaignsByQuery = asyncHandler(async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      status: req.query.status,
      category: req.query.category,
      startDate: {
        $gte: req.query.startDate,
        $lte: req.query.endDate,
      },
      campaignName: req.query.campaignName,
      targetFunds: {
        $gte: req.query.minTargetFunds,
        $lte: req.query.maxTargetFunds,
      },
    })
      .sort({ startDate: -1 })
      .limit(req.query.limit)
      .skip(req.query.skip)
      .exec();
    return res
      .status(200)
      .json(new ApiResponse(200, campaigns, "Campaigns fetched successfully"));
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

const getCampaignsByPopularity = asyncHandler(async (req, res) => {
  await Campaign.aggregate([
    {
      $project: {
        _id: 1,
        numberOfDonations: { $size: "$donations" },
        numberOfLikes: { $size: "$likes" },
        numberOfComments: { $size: "$comments" },
        numberOfDonors: { $size: "$donors" },
        totalNumbers: {
          $add: [
            "$numberOfDonations",
            "$numberOfLikes",
            "$numberOfComments",
            "$numberOfDonors",
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        popularityScore: { $avg: "$totalNumbers" },
      },
    },
    {
      $merge: {
        into: "campaigns",
        on: "_id",
        whenMatched: "merge",
        whenNotMatched: "skip",
      },
    },
  ]);
});

//TODO: Get the adress of a campaign using aggregators

const searchCampaigns = asyncHandler(async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      $text: {
        $search: req.query.search,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, campaigns, "Campaigns fetched successfully"));
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

const getACampaign = asyncHandler(async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const campaign = await Campaign.findById(campaignId);
    if (campaign.adress) {
      campaign.adress = await Adress.findById(campaign.adress);
    }
    if (campaign) {
      return res
        .status(200)
        .json(new ApiResponse(200, campaign, "Campaign fetched successfully"));
    } else {
      return new ApiError(
        404,
        "Campaign not found",
        "Campaign not found",
        "MISCELLANEOUS"
      );
    }
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

const updateACampaign = asyncHandler(async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const campaignDetails = await req.body();
    const result = campaignSchema.safeParse(campaignDetails);
    if (result.success) {
      const existedCampaign = await Campaign.findById(campaignId);
      if (existedCampaign) {
        const updatedCampaign = await Campaign.findByIdAndUpdate(
          campaignId,
          result.data,
          { new: true }
        );
        return res
          .status(200)
          .json(new ApiResponse(200, updatedCampaign, "Campaign updated"));
      } else {
        return new ApiError(
          400,
          "Campaign not found",
          "Campaign not found",
          "DATABASE"
        );
      }
    } else if (result.error) {
      return new ApiError(
        400,
        "Data Validation Failed",
        result.error.flatten().fieldErrors,
        "VALIDATION"
      );
    }
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

const markACampaignAsComplete = asyncHandler(async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const campaign = await Campaign.findById(campaignId);
    if (campaign) {
      campaign.status = "Completed";
      const updatedCampaign = await Campaign.findByIdAndUpdate(
        campaignId,
        campaign,
        { new: true }
      );
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedCampaign,
            "Campaign marked as completed successfully"
          )
        );
    } else {
      return new ApiError(
        404,
        "Campaign not found",
        "Campaign not found",
        "MISCELLANEOUS"
      );
    }
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

//Use mongodb aggregation to get all of the donations for a campaign only using Campaign schema
const getDonationsForACampaign = asyncHandler(async (req, res) => {
  try {
    const donations = await Campaign.aggregate([
      {
        $match: {
          _id: req.params.campaignId,
        },
      },
      {
        $lookup: {
          from: "donations",
          localField: "_id",
          foreignField: "campaign",
          as: "donations",
        },
      },
      {
        $unwind: "$donations",
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, donations, "Donations fetched successfully"));
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

const getAllTheDonorsForACampaign = asyncHandler(async (req, res) => {
  try {
    const donors = await Campaign.aggregate([
      {
        $match: {
          _id: req.params.campaignId,
        },
        $lookup: {
          from: "donations",
          localField: "_id",
          foreignField: "campaign",
          as: "donations",
        },
        $unwind: "$donations",
        $lookup: {
          from: "users",
          localField: "donations.donor",
          foreignField: "_id",
          as: "donors",
        },
        $unwind: "$donors",
        $group: {
          _id: "$donors._id",
          donations: {
            $sum: "$donations.amount",
          },
        },
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, donors, "Donors fetched successfully"));
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

export {
  listACampaign,
  getAllCampaigns,
  getACampaign,
  updateACampaign,
  markACampaignAsComplete,
  getDonationsForACampaign,
  getAllTheDonorsForACampaign,
  getCampaignsByPopularity,
  getCampaignsByQuery,
  searchCampaigns,
  addMembersToACampaign,
};
