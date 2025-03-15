import Donations from "../models/donations.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { instance } from "../app.js";

/*
1. Get all the donation details,
2. Chheck all the donation details,
3. Create a new donation,
4. Create a new payment,
5. Save the detials in the donation and payment model,
6. Return the donation details and success message.
*/

const makeADonation = asyncHandler(async (req, res) => {
  const donor = req.user._id;
  const campaign = req.params.campaignId;
  const { amount } = req.body;

  const donation = await Donations.create({
    donor,
    campaign,
    payment: null,
  });

  await donation.save();

  const options = {
    amount: Number(amount * 100),
    currency: "INR",
    receipt: "",
  };

  instance.orders.create(options, (err, order) => {
    if (err) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "PAYMENT FAILED",
            "Check the payment details and try again",
            { reason: err.error.reason, description: err.error.description },
            "Please check and redo the payment process again"
          )
        );
    }

    donation.orderId = order.id;
    donation.save();

    return res
      .status(201)
      .json(new ApiResponse(201, "DONATION SUCCESSFUL", donation));
  });
});

export { makeADonation };
