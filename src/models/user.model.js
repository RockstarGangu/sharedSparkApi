import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    location: {
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
      // required: true,
    },
    adress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Adress",
      // required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    campaignsHosted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
    },
    donations: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    },
    avatar:{
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
