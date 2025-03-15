import { Router } from "express";
import { likeACampaign, unlikeACampaign, getLikesForACampaign } from "../controllers/likes.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/like/:campaignId").post(verifyJWT, likeACampaign);
router.route("/unlike/:campaignId").delete(verifyJWT, unlikeACampaign);
router.route("/get-likes/:campaignId").get(verifyJWT, getLikesForACampaign);

export default router;