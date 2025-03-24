import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// using ApiResponse utility
import { ApiResponse } from "../utils/ApiResponse.js";

// to generate access and refresh token
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId); // get the user using userId
    // using methods we defined in user model for generating access token and refresh token
    const accessToken = user.generateAccessToken(); // sends to user
    const refreshToken = user.generateRefreshToken(); // save to db -> so no need to ask password from user
    user.refreshToken = refreshToken; // saving refresh token to the db
    // saving the user
    await user.save({ validateBeforeSave: false }); // save method also kickin all required fields validation (like password, but we are just passing refreshToken), so we are passing validateBeforeSave: false
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
  // TO GET USER DETAILS
  const { fullname, email, username, password } = req.body;
  console.log("email:", email);

  // VALIDATION
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // CHECK IF USER ALREADY EXISTS OR NOT
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // console.log(req.files);

  // CHECK OF IMAGES AND AVATAR
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // UPLOAD THEM TO CLOUDINARY
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // CREATE ENTRY IN DATABASE
  // User is talking to DB

  const user = await User.create({
    // whatever we want to enter in the db
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Check user is created in db or not and remove password and refresh token from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // RETURN RESPONSE
  return res.status(201).json(
    // as we have created a class for that in ApiResponse, we are creating a new object for this
    new ApiResponse(200, createdUser, "User Registered Successfully")
  );
});

// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
  // take data from req>body ( req body → data)
  const { email, username, password } = req.body;

  // username / email is passed or not
  if (!(username || email)) {
    throw new ApiError(400, "username or password is required");
  }

  // find the user
  const user = await User.findOne({ $or: [{ email }, { username }] });
  // if user not found throw error
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  /* User -> mongoose obj, can access methods available through mongoose, like findOne, updateOne
user -> instance of our current database user, can access our made method, like isPasswordCorrect
 */

  // user found -> then check password -> using bcrypt
  const isPasswordValid = await user.isPasswordCorrect(password); // passing the password in the fn and return true or false
  // throw if false -> password didn't match
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  ); // await coz we are doing async operation for interacting with db

  // send them in cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    // by default cookies can be accessed by js (frontend), so we are making it httpOnly (modifiable by server only)
    httpOnly: true,
    secure: true,
  };

  // return response
  return (
    res
      .status(200)
      // we injected cookie parser as middleware, so we can use res.cookie
      .cookie("accessToken", accessToken, options) // setting access token
      .cookie("refreshToken", refreshToken, options) // setting refresh token
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          }, // to handle the case when user want to save the token in local storage
          "User logged in successfully"
        )
      )
  );
});

// LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
  // remove refresh token from db
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined }, // setting refresh token to undefined
    },
    {
      new: true, // return the updated user
    }
  );

  // clear the cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// REFRESH ACCESS TOKEN
const refreshAccessToken = asyncHandler(async (req, res) => {
  // needed a refresh token, can access from cookies
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken; // if not in cookies, then in body
  // if not found
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    // verify incoming token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // find user
    const user = await User.findById(decodedToken?._id);
    // if not found
    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    // matching token
    // if not match
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, " refresh token is expired or used");
    }
    // if matched -> generate new tokens, using generateAccessAndRefreshTokens method
    const options = { httpOnly: true, secure: true };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    // return response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// CHANGE CURRENT PASSWORD
const changeCurrentPassword = asyncHandler(async (req, res) => {
  // no need to check login, as we will apply middleware verifyJWT
  // taking fields from req.body
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id); // get the user from req.user._id
  const isPasswordCorrect = user.isPasswordCorrect(oldPassword); // check if old password is correct or not
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  };
  user.password = newPassword; // set new password
  await user.save(validateBeforeSave: false); // save the user
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

// GET CURRENT USER
const getCurrentUser = asyncHandler(async (req, res) => {
  // no need to check login, as we will apply middleware verifyJWT
  // get user from req.user
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User found successfully"));
});

// UPDATE ACCOUNT DETAILS
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body; // good approach is to make separate controller for updating files

  // validation
  if(!fullname || !email) {
    throw new ApiError(400, "All fields are required");
  }

  // find user and update
  const user = User.findByIdAndUpdate(
    req.user._id, // get user from req.user._id
    {   // using mongodb operator sets
      $set: {
        fullname,
        email:email,  // anyways can be written
    }
  }, {
    new: true   // to get new updated user
  }).select("-password"); // remove password from response

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});


export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails };
