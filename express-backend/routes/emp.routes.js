import { Router } from "express";
import { displayEmp, loginEmp, logoutEmp, refreshAccessToken, registerEmp, getEmpLeave, deleteAppliedleave } from "../controllers/emp.controller.js";
import { verifyEmpJWT } from "../middlewares/empAuth.middleware.js";


const router = Router()

router.route("/register").post(registerEmp);
router.route("/login").post(loginEmp);

//secured routes
router.route("/find").get(verifyEmpJWT , displayEmp);
router.route("/logout").post(verifyEmpJWT , logoutEmp)
router.route("/refreshAccessToken").post(refreshAccessToken)
router.route("/empLeaveStatus").get( getEmpLeave)
router.route("/deleteAppliedLeave").post(verifyEmpJWT , deleteAppliedleave)

export default router;
