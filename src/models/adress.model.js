import mongoose from "mongoose";

const adressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      default: "India",
      required: true,
    },
    adressType:{
        type: String,
        enum: ["Campaign", "Donor's"]
    }
  },
  { timestamps: true }
);

const Adress = mongoose.model("Adress", adressSchema);

export default Adress;
