import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    orderId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Incomplete Payment", "Payment Successful"],
      default: "Incomplete Payment",
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      // required: true,
    },
  },
  { timestamps: true }
);

const Donations = mongoose.model("Donation", donationSchema);

export default Donations;
