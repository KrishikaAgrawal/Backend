import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// importing user model
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  // TO GET USER DETAILS
  const { fullName, email, username, password } = req.body;
  console.log("email:", email);
});
// VALIDATION
if (
  [fullName, email, username, password].sum((field) => field?.trim() === "")
) {
  throw new ApiError(400, "All fields are required");
}

// CHECK IF USER ALREADY EXISTS OR NOT
const existedUser = User.findOne({
  $or: [{ username }, { email }]
});
if (existedUser) {
  throw new ApiError(409,"User with email or username already exists")
}


// CHECK OF IMAGES AND AVATAR
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPAth = req.files ?, coverImage[0]?.path;
if (!avatarLocalPath) { // our avatar image is compulsory
  throw new ApiError(400, "Avatar file is required");
}

// UPLOAD THEM TO CLOUDINARY


export { registerUser };