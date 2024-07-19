import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  getCurrentUser,
  updateAccountDatiels,
  updateUserAvatar,
  updateUserCoverImage,
  watchHistory,
  getchannelUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.midleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

// secured route

router.route("/logout").post(verifyJwt, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentUserPassword);
router.route("/current-User").get(verifyJwt, getCurrentUser);
router.route("/update-details").patch(updateAccountDatiels);
router
  .route("/avatar")
  .patch(verifyJwt, upload.single("avatar"), updateUserAvatar);
router
  .route("/coverImage")
  .patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage);
router.route("/watch-history").get(watchHistory);
router.route("/c/:username").get(verifyJwt, getchannelUserProfile);

export default router;
