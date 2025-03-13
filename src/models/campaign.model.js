import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    campaignName: {
      type: String,
      required: true,
      unique: true,
    },
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
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Completed"],
      default: "Active",
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
    validationProofType: {
      type: String,
      enum: [
        "AdharCard",
        "Passport",
        "PanNumber",
        "NGOCertificationNumber",
        "SEBICertificationNumber",
        "Other",
      ],
    },
    validationProofNumber: {
      type: String,
      required: true,
      unique: true,
    },
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
      default: 0,
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
    shares: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Likes",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    popularityScore:{
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;
