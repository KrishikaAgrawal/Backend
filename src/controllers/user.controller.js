import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// using ApiResponse utility
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // TO GET USER DETAILS
  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  // VALIDATION
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // CHECK IF USER ALREADY EXISTS OR NOT
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

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
  const user= async User.create({
    // whatever we want to enter in the db
    fullname,
    avatar: avatar.url, // from cloudinary utility, are all getting whole avatar object, but we just want to pass url in db
    // coverImage: coverImage.url, // problem is, as it was not compulsory field, we didn't check user has given it or not, so
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase(),  // we want to save it in lower case
  });

  // Check user is created in db or not and remove password and refresh token from response
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  
  if (!createdUser) {
    throw new ApiError(500,"Something went wrong while registering the user")
  }

  // RETURN RESPONSE
  return res.status(201).json(
    // as we have created a class for that in ApiResponse, we are creating a new object for this
    new ApiResponse(200,createdUser, "User Registered Successfully")
  )
});

export { registerUser };
