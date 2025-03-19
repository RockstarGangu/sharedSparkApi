import { Router } from "express";
import {
  addACampaignAdress,
  addADonorAdress,
  deleteAdress,
  updateCampaignAdress,
  updateDonorAdress,
} from "../controllers/adress.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router
  .route("/add-a-campaign-adress/:campaignId")
  .post(verifyJWT, addACampaignAdress);
router.route("/add-a-donor-adress/").post(verifyJWT, addADonorAdress);
router
  .route("/update-a-campaign-adress/:campaignId")
  .patch(verifyJWT, updateCampaignAdress);
router.route("/update-a-donor-adress").patch(verifyJWT, updateDonorAdress);
router.route("/delete-a-adress/:adressId").delete(verifyJWT, deleteAdress);
