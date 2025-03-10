import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
    required: true,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
