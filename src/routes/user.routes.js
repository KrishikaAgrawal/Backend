import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// register user
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
      {
          name: "coverImage",
          maxCount:1
    },
  ]),
  registerUser
);

// login user
router.route("/login").post(loginUser);

// logout user
router.route("/logout").post(verifyJWT, logoutUser);  // next in the middleware tells verifyJWT then next logoutUser

export default router;
