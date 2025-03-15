import Donations from "../models/donations.model.js";
import Payment from "../models/payment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

const paymentVerfication = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_signature,
    razorpay_payment_id,
    amount,
    paymentMethod,
    status,
  } = req.body;
  const { donorId } = req.user._id;
  const { donationId } = req.query;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const exceptedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_TEST_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isValid = razorpay_signature === exceptedSignature;
  if (isValid) {
    const payment = await Payment.create({
      amount,
      paymentMethod,
      status,
      razorpaySignature: exceptedSignature,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      donation: donationId,
      donor: donorId,
    });

    const donation = await Donations.findOne({
      orderId: razorpay_order_id,
    });
    if (donation) {
      donation.payment = payment._id;
      donation.status = "Payment Successful";
      donation.save();
    }
    return res
      .status(200)
      .json(new ApiResponse(200, payment, "PAYMENT SUCCESSFUL"));
  } else {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "INVALID PAYMENT RECEIVED",
          "Payment signature is invalid",
          "_",
          "Please check and redo the payment process again"
        )
      );
  }
});

export { paymentVerfication };
