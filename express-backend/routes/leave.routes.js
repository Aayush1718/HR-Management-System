import { Router } from "express";
import { registerLeave } from "../controllers/leave.controller.js";



const router = Router()

router.route("/registerLeave").post(registerLeave)

export default router;