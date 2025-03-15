import Adress from "../models/adress.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { adressSchema } from "../zodSchema/adress.schema.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Campaign from "../models/campaign.model.js";
import User from "../models/user.model.js";

const addACampaignAdress = asyncHandler(async (req, res) => {
  const campaignId = req.params.campaignId;
  const adress = req.body;
  if (Object.keys(adress).length === 0) {
    return new ApiError(
      400,
      "INPUT DATA",
      "Provide adress details",
      "Invalid/Empty credentials",
      "CHECK CREDENTIALS",
      "/addACampaignAdress"
    );
  }
  const result = adressSchema.safeParse(adress);
  if (result.success && result.data.adressType === "Campaign") {
    const adress = await Adress.create(result.data);

    const addedAdress = await Adress.findById(adress._id);
    if (!addedAdress) {
      return new ApiError(
        500,
        "INTERNAL SERVER ERROR",
        "Something went wrong",
        "Internal Server Error",
        "Please check the status of the server and Database",
        "/addACampaignAdress"
      );
    }

    const campaign = await Campaign.findById(campaignId);
    campaign.adress = adress._id;
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      campaignId,
      campaign,
      { new: true }
    );
    if (!updatedCampaign) {
      return new ApiError(
        500,
        "INTERNAL SERVER ERROR",
        "Something went wrong",
        "Internal Server Error",
        "Please check the status of the server and Database",
        "/addACampaignAdress"
      );
    }
    return res
      .status(201)
      .json(new ApiResponse(200, updatedCampaign, "Campaign updated"));
  } else if (result.error) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "INPUT VALIDATION",
          result.error.issues[0].message,
          "Zod Validation Error",
          "Please check the input fields",
          result.error.path || "/addACampaignAdress"
        )
      );
  }
});

const addADonorAdress = asyncHandler(async (req, res) => {
  const donorId = req.params.donorId;
  const adress = req.body;
  if (Object.keys(adress).length === 0) {
    return new ApiError(
      400,
      "INPUT DATA",
      "Provide adress details",
      "Invalid/Empty credentials",
      "CHECK CREDENTIALS",
      "/addADonorAdress"
    );
  }
  const result = adressSchema.safeParse(adress);
  if (result.success && result.data.adressType === "Donor") {
    const adress = await Adress.create(result.data);

    const addedAdress = await Adress.findById(adress._id);
    if (!addedAdress) {
      return new ApiError(
        500,
        "INTERNAL SERVER ERROR",
        "Something went wrong",
        "Internal Server Error",
        "Please check the status of the server and Database",
        "/addADonorAdress"
      );
    }

    const donor = await User.findById(donorId);
    donor.adress = adress._id;
    const updatedDonor = await User.findByIdAndUpdate(donorId, donor, {
      new: true,
    });
    if (!updatedDonor) {
      return new ApiError(
        500,
        "INTERNAL SERVER ERROR",
        "Something went wrong",
        "Internal Server Error",
        "Please check the status of the server and Database",
        "/addADonorAdress"
      );
    }
    return res
      .status(201)
      .json(new ApiResponse(200, updatedDonor, "Donor updated"));
  } else if (result.error) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "INPUT VALIDATION",
          result.error.issues[0].message,
          "Zod Validation Error",
          "Please check the input fields",
          result.error.path || "/addADonorAdress"
        )
      );
  }
});

const updateCampaignAdress = asyncHandler(async (req, res) => {
  const adressId = req.params.adressId;
  const adress = req.body;
  if (Object.keys(adress).length === 0) {
    return new ApiError(
      400,
      "INPUT DATA",
      "Provide adress details",
      "Invalid/Empty credentials",
      "CHECK CREDENTIALS",
      "/updateCampgainAdress"
    );
  }
  const result = adressSchema.safeParse(adress);
  if (result.success && result.data.adressType === "Campaign") {
    const adress = await Adress.findById(adressId);
    if (!adress) {
      return new ApiError(
        404,
        "INPUT VALIDATION",
        "Adress not found",
        "Adress not found",
        "Please check your authentication status",
        "/updateCampgainAdress"
      );
    }
    const updatedAdress = await Adress.findByIdAndUpdate(
      adressId,
      result.data,
      { new: true }
    );
    if (!updatedAdress) {
      return new ApiError(
        500,
        "INTERNAL SERVER ERROR",
        "Something went wrong",
        "Internal Server Error",
        "Please check the status of the server and Database",
        "/updateCampgainAdress"
      );
    }
    return res.status(200).json(new ApiResponse(200, updatedAdress));
  } else if (result.error) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "INPUT VALIDATION",
          result.error.issues[0].message,
          "Zod Validation Error",
          "Please check the input fields",
          result.error.path || "/updateCampgainAdress"
        )
      );
  }
});

const updateDonorAdress = asyncHandler(async (req, res) => {
  const adressId = req.params.adressId;
  const adress = req.body;
  if (Object.keys(adress).length === 0) {
    return new ApiError(
      400,
      "INPUT DATA",
      "Provide adress details",
      "Invalid/Empty credentials",
      "CHECK CREDENTIALS",
      "/updateDonorAdress"
    );
  }
  const result = adressSchema.safeParse(adress);
  if (result.success && result.data.adressType === "Donor") {
    const adress = await Adress.findById(adressId);
    if (!adress) {
      return new ApiError(
        404,
        "INPUT VALIDATION",
        "Adress not found",
        "Adress not found",
        "Please check your authentication status",
        "/updateDonorAdress"
      );
    }
    const updatedAdress = await Adress.findByIdAndUpdate(
      adressId,
      result.data,
      { new: true }
    );
    if (!updatedAdress) {
      return new ApiError(
        500,
        "INTERNAL SERVER ERROR",
        "Something went wrong",
        "Internal Server Error",
        "Please check the status of the server and Database",
        "/updateDonorAdress"
      );
    }
    return res.status(200).json(new ApiResponse(200, updatedAdress));
  } else if (result.error) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "INPUT VALIDATION",
          result.error.issues[0].message,
          "Zod Validation Error",
          "Please check the input fields",
          result.error.path || "/updateDonorAdress"
        )
      );
  }
});

const deleteAdress = asyncHandler(async (req, res) => {
  const adressId = req.params.adressId;
  const deletedAdress = await Adress.findByIdAndDelete(adressId);
  if (!deletedAdress) {
    return new ApiError(
      404,
      "INPUT VALIDATION",
      "Adress not found",
      "Adress not found",
      "Please check your authentication status",
      "/deleteAdress"
    );
  }
  return res.status(200).json(new ApiResponse(200, deletedAdress,"Adress deleted"));
});

export {
  addACampaignAdress,
  addADonorAdress,
  updateCampaignAdress,
  updateDonorAdress,
  deleteAdress,
};