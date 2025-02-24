import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

// import multer
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    // 2 objects as we are uploading 2 files avatar, cover image
    {
      name: "avatar", // frontend field must be names as avatar too
      maxCount: 1,
    },
      {
          name: "coverImage",
          maxCount:1
    },
  ]),
  registerUser
);

export default router;
