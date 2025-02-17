import { asyncHandler } from "../utils/asyncHandler.js";

// asyncHandler accept a n async function, where we have req and res
const registerUser = asyncHandler(async (req, res) => {
  // sending the json response and status 200
  res.status(200).json({
    message: "ok",
  });
});

export { registerUser };
