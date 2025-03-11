import Campaign from "../models/campaign.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";
import { campaignSchema } from "../zodSchema/campaign.schema";

const listACampaign = asyncHandler(async (req, res) => {
  try {
    const campaignDetails = await req.body();
    const result = campaignSchema.safeParse(campaignDetails);
    if (result.success) {
      const existedCampaign = await Campaign.findOne({
        validationProofNumber: result.data.validationProofNumber,
      });
      if (existedCampaign) {
        return new ApiError(
          400,
          "Campaign already exists",
          "Campaign already exists",
          "DATABASE"
        );
      }
      const campaign = await Campaign.create(result.data);
      return res
        .status(201)
        .json(new ApiResponse(200, campaign, "Campaign created successfully"));
    } else if (result.error) {
      return new ApiError(
        400,
        "Data Validation Failed",
        result.error,
        "VALIDATION"
      );
    }
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

//TODO: Only fetch nearby campaigns to the user's location
const getAllCampaigns = asyncHandler(async (req, res) => {
  try {
    const campaigns = await Campaign.find();
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
        result.error,
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


export {
  listACampaign,
  getAllCampaigns,
  getACampaign,
  updateACampaign,
  markACampaignAsComplete,
};
