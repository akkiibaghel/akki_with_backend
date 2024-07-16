import { Router } from "express";
import {registerUser ,loginUser,logoutUser,
    refreshAccessToken, changeCurrentUserPassword,
    getCurrentUser,updateAccountDatiels,
    updateUserAvatar,updateUserCoverImage
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.midleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
router.route("/login").post(loginUser)

// secured route 

router.route("/logout").post(verifyJwt, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/refreshtoken").post(changeCurrentUserPassword)
router.route("/currentUser").get(getCurrentUser)
router.route("/updateuser").post(updateAccountDatiels)
router.route("/avatarupdate").post(updateUserAvatar)
router.route("/coverimageupdate").post(updateUserCoverImage)

export default router