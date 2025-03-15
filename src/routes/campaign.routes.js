import { Router } from "express";
import {
  listACampaign,
  getACampaign,
  updateACampaign,
  markACampaignAsComplete,
  getDonationsForACampaign,
  getAllTheDonorsForACampaign,
  getCampaignsByPopularity,
  searchCampaigns,
  getAllCampaigns,
  getCampaignsByQuery,
  addMembersToACampaign,
} from "../controllers/campaign.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/list").post(verifyJWT, listACampaign);
router.route("/get-all-campaigns").get(verifyJWT, getAllCampaigns);
router.route("/get/:campaignId").get(verifyJWT, getACampaign);
router.route("/update/:campaignId").patch(verifyJWT, updateACampaign);
router.route("/mark/:campaignId").patch(verifyJWT, markACampaignAsComplete);
router
  .route("/getDonations/:campaignId")
  .get(verifyJWT, getDonationsForACampaign);
router
  .route("/getDonors/:campaignId")
  .get(verifyJWT, getAllTheDonorsForACampaign);
router.route("/getPopularity").get(verifyJWT, getCampaignsByPopularity);
router.route("/search").get(verifyJWT, searchCampaigns);
router.route("/campaigns").get(verifyJWT, getCampaignsByQuery);
router.route("/addMembers/:campaignId").patch(verifyJWT, addMembersToACampaign);

export default router;
