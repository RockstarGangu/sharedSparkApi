import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            "Unauthorized request",
            "Please login to access this route",
            "MISCELLANEOUS"
          )
        );
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            "Invalid Access Token",
            "User not found",
            "DATABASE"
          )
        );
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(
        new ApiError(401, error?.message, "Invalid access token", "INTERNAL")
      );
  }
});
