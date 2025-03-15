import { Router } from "express";
import {
  commentOnACampaign,
  unCommentOnACampaign,
  getCommentsForACampaign,
  replyToAComment,
  getRepliesForAComment,
} from "../controllers/comments.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/comment/:campaignId").post(verifyJWT, commentOnACampaign);
router.route("/delete/:commentId").delete(verifyJWT, unCommentOnACampaign);
router.route("/reply/:commentId").post(verifyJWT, replyToAComment);
router
  .route("/get-replies/:commentId")
  .delete(verifyJWT, getRepliesForAComment);
router
  .route("/get-comments/:campaignId")
  .get(verifyJWT, getCommentsForACampaign);

export default router;
