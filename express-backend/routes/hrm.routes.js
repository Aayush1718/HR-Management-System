import { Router } from "express";
import { loginHrm, logoutHrm, registerHrm, refreshAccessToken, displayPendingLeaves, approveLeave, rejectLeave, displayApprovedLeaves, displayRejectedLeaves } from "../controllers/hrm.controller.js";
import { verifyHrmJWT } from "../middlewares/hrmAuth.middleware.js";


const router = Router()

router.route("/register").post(registerHrm);
router.route("/login").post(loginHrm);

//secured routes
router.route("/logout").post(verifyHrmJWT , logoutHrm)
router.route("/refreshAccessToken").post(refreshAccessToken)
router.route("/displayPendingLeaves").get(verifyHrmJWT , displayPendingLeaves)
router.route("/approveLeaves").post(verifyHrmJWT , approveLeave)
router.route("/rejectLeaves").post(verifyHrmJWT , rejectLeave)
router.route("/displayApprovedLeaves").get(verifyHrmJWT , displayApprovedLeaves)
router.route("/displayRejectedLeaves").get(verifyHrmJWT , displayRejectedLeaves)



export default router;
