import { Router } from "express";
import { makeADonation } from "../controllers/donation.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/donate/:campaignId").post(verifyJWT, makeADonation);

export default router;