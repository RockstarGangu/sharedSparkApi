import { Router } from "express";
import {
  getAllUserDonations,
  getAllUserHostedCampaigns,
  getAllUsersByName,
  getUserById,
  loginUser,
  logOutUser,
  registerUser,
  updateUserDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);

//Protected Routes
router.route("/currentUser").get(verifyJWT, getUserById);
router.route("/logout").get(verifyJWT, logOutUser);
router.route("/updateUserDetails").patch(verifyJWT, updateUserDetails);
router.route("/getAllUserDonations").get(verifyJWT, getAllUserDonations);
router
  .route("/getAllUserHostedCampaigns")
  .get(verifyJWT, getAllUserHostedCampaigns);
router.route("/getAllUsersByName").get(verifyJWT, getAllUsersByName);

export default router;
