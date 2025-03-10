import mongoose, { Types } from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    dealine: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Completed"],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donations",
      },
    ],
    adress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adress",
      required: true,
    },
    location: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },
    targetFunds: {
      type: Number,
      required: true,
    },
    targetReach: {
      type: Number,
      required: true,
    },
    sponsors: [
      {
        type: String,
      },
    ],
    flags: {
      type: String,
      enum: ["Approved", "Rejected", "Reviewing"],
      default: "Reviewing",
    },
    category: {
      type: String,
      enum: [
        "Social",
        "Environment",
        "Education",
        "Health",
        "Animal",
        "Sports",
        "Entertainment",
        "Other",
      ],
      default: "Other",
    },
    media: [
      {
        type: String,
      },
    ],
    donors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    shares:{
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
