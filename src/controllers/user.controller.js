import { asyncHandler } from "../utils/asyncHandler.js";
import {
  loginUserSchema,
  updateUserSchema,
  userSchema,
} from "../zodSchema/user.schema.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
      error,
      "INTERNAL"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const userDetails = req.body;

  const result = userSchema.safeParse(userDetails);
  if (result.success) {
    // console.log("result", result);
    const { email } = result.data;
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "USER FAULT",
            "User with this credentials already exist",
            "Invalid credentials",
            "Please check the authentication status",
            "/signin"
          )
        );
    }
    const user = await User.create(result.data);
    if (!user) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "INPUT DATA",
            "User not found",
            "Invalid credentials",
            "Check credentials",
            "/signin"
          )
        );
    }

    const newUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!newUser) {
      throw new ApiError(
        500,
        "Internal Server Error",
        "User not found",
        "DATABASE"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          user: newUser,
        },
        "User registered successfully"
      )
    );
  } else if (result.error) {
    return res.send(result.error.issues[0].message);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const userDetails = req.body;
    const result = loginUserSchema.safeParse(userDetails);
    if (result.success) {
      const { email, password } = result.data;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "INPUT DATA",
              "User not found",
              "Invalid credentials",
              "Check credentials",
              "/signin"
            )
          );
      }

      const isPasswordCorrect = await user.comparePassword(password);

      if (!isPasswordCorrect) {
        return res
          .status(400)
          .json(
            new ApiError(
              400,
              "MISCELLANEOUS",
              "Invalid Credentials",
              "Invalid Credentials",
              "Please check the credentials",
              "/signin"
            )
          );
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );

      const newUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      if (!newUser) {
        return res
          .status(500)
          .json(
            new ApiError(
              500,
              "DATABASE",
              "Something went wrong",
              "Internal Server Error",
              "Check the status of the server and Database",
              "/signin"
            )
          );
      }

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              accessToken,
              refreshToken,
              user: newUser,
            },
            "User logged in successfully"
          )
        );
    } else if (result.error) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "INPUT VALIDATION",
            result.error.issues[0].message,
            "Zod Validation Error",
            "Please check the input fields",
            result.error.path || "/signin"
          )
        );
    }
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiError(
          500,
          "INTERNAL SERVER ERROR",
          "Something went wrong",
          error,
          "Please check the status of the server",
          "/signin"
        )
      );
  }
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      res
        .status(404)
        .json(
          new ApiError(
            404,
            "INPUT VALIDATION",
            "User not found",
            "User not found",
            "Please check your authentication status",
            "/getUserById"
          )
        );
    }
    const newUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!newUser) {
      res
        .status(500)
        .json(
          new ApiError(
            500,
            "INTERNAL SERVER ERROR",
            "Something went wrong",
            "Internal Server Error",
            "Please check the status of the server and Database",
            "/getUserById"
          )
        );
    }
    return res.status(200).json(new ApiResponse(200, newUser, "User found"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "INTERNAL SERVER ERROR",
          "Something went wrong",
          error,
          "Please check the status of the server",
          "/getUserById"
        )
      );
  }
});

const getAllUsersByName = asyncHandler(async (req, res) => {
  try {
    const name = req.query.name;
    const users = await User.find({
      $or: [{ firstName: name }, { lastName: name }],
    }).select("+avatar +firstName +lastName");
    return res.status(200).json(new ApiResponse(200, users, "Users found"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "INTERNAL SERVER ERROR",
          "Something went wrong",
          error,
          "Please check the status of the server",
          "/getAllUsersByName"
        )
      );
  }
});

const logOutUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "INTERNAL SERVER ERROR",
          "Something went wrong",
          error,
          "Please check the status of the server",
          "/logOutUser"
        )
      );
  }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return new ApiError(
      401,
      "unauthorized request",
      "Refresh token is missing",
      "MISCELLANEOUS"
    );
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return new ApiError(
        401,
        "Invalid refresh token",
        "Invalid refresh token",
        "MISCELLANEOUS"
      );
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    return new ApiError(
      401,
      error?.message,
      "Invalid refresh token",
      "INTERNAL"
    );
  }
});

const updateUserDetails = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const userDetails = req.body;
    if (Object.keys(userDetails).length === 0) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "INPUT DATA",
            "Provide user details",
            "Invalid/Empty credentials",
            "Check credentials",
            "/updateUserDetails"
          )
        );
    }
    const result = updateUserSchema.safeParse(userDetails);
    if (result.success) {
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json(
            new ApiError(
              404,
              "INPUT VALIDATION",
              "User not found",
              "User not found",
              "Please check your authentication status",
              "/updateUserDetails"
            )
          );
      }
      const updatedUser = await User.findByIdAndUpdate(userId, result.data, {
        new: true,
      });
      if (!updatedUser) {
        return res
          .status(500)
          .json(
            new ApiError(
              500,
              "INTERNAL SERVER ERROR",
              "Something went wrong",
              "Internal Server Error",
              "Please check the status of the server and Database",
              "/updateUserDetails"
            )
          );
      }
      return res.status(200).json(new ApiResponse(200, updatedUser));
    } else if (result.error) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "INPUT VALIDATION",
            result.error.issues[0].message,
            "Zod Validation Error",
            "Please check the input fields",
            result.error.path || "/updateUserDetails"
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "INTERNAL SERVER ERROR",
          "Something went wrong",
          error,
          "Please check the status of the server",
          "/updateUserDetails"
        )
      );
  }
});

// const changeUserPassword = asyncHandler(async (req, res) => {
//   const user = req.user._id;
//   const newPassword = req.body.newPassword;
//   if(!user){
//     return new ApiError(400, "User not found", "User not found", "DATABASE");
//   }
//   const checkPassword = await User.findById(user).comparePassword(newPassword);
//   if(!checkPassword){
//     return new ApiError(400, "Invalid Password", "Invalid Password", "MISCELLANEOUS");
//   }
// });

//Getting all the donations made by the user using aggregators
const getAllUserDonations = asyncHandler(async (req, res) => {
  try {
    const donations = await User.aggregate([
      {
        $match: {
          _id: req.user._id,
        },
      },
      {
        $lookup: {
          from: "donations",
          localField: "donations",
          foreignField: "_id",
          as: "userDonations",
        },
      },
      {
        $project: {
          userDonations: 1,
        },
      },
    ]);
    res.status(201).json(new ApiResponse(200, donations, "Donations found"));
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});
//Getting all the hosted campaigns by the user using aggregators
const getAllUserHostedCampaigns = asyncHandler(async (req, res) => {
  try {
    const hostedCampaigns = await User.aggregate([
      {
        $match: {
          _id: req.user._id,
        },
      },
      {
        $lookup: {
          from: "campaigns",
          localField: "campaignsHosted",
          foreignField: "_id",
          as: "hostedCampaigns",
        },
      },
      {
        $project: {
          hostedCampaigns: 1,
        },
      },
    ]);
    res
      .status(201)
      .json(new ApiResponse(200, hostedCampaigns, "Campaigns found"));
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

const getUserAdress = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return new ApiError(404, "User not found", null, "USER_NOT_FOUND");
    }
    const userAdress = await User.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $lookup: {
          from: "adresses",
          localField: "adresses",
          foreignField: "_id",
          as: "adresses",
        },
      },
      {
        $project: {
          adresses: 1,
        },
      },
      {
        $unwind: {
          path: "$adresses",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    res.status(200).json(new ApiResponse(200, userAdress, "User adress found"));
  } catch (error) {
    return new ApiError(500, "Internal Server Error", error, "INTERNAL");
  }
});

export {
  registerUser,
  loginUser,
  getUserById,
  logOutUser,
  refreshAccessToken,
  updateUserDetails,
  getAllUserDonations,
  getAllUserHostedCampaigns,
  getAllUsersByName,
  getUserAdress,
};
