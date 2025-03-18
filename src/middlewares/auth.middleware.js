// this middleware is used to verify the JWT token (user exist or not)

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // request has cookies access
    // optional chaining -> if cookie is not present in case of mobile app, in that case user will send token in headers (mostly, authorization, format-> Bearer <token>, we just want token, so replace Bearer with empty string)
    const token =
      req.cookies?.accessToken ||
      req.headers("Authorization")?.replace("Bearer ", "");

    // if token not found
    if (!token) {
      throw new ApiError(401, "Unauthorized token");
    }

    // if token found
    // verify token -> using jwt
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // passing -> token (that needs to verify), secret key (to verify the token), returns -> decoded token

    // find the user with the id in the decoded token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    // if user not found
    if (!user) {
      throw new ApiError(404, "Invalid Access Token");
    }

    // if user found
    // attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalud Access Token");
  }
});
