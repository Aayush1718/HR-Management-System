import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Hrm } from "../model/HmrsDatabase/Hrm.models.js";


export const verifyHrmJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken
        
        if (!token){
            throw new apiError (401, "Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const hrm= await Hrm.findById(decodedToken?._id).select("-hrmPassword -refreshToken")
    
        if(!hrm){
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.hrm = hrm
        
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Access Token")
    }

})
