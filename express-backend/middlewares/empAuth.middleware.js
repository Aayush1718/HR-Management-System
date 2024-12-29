import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {Emp} from "../model/HmrsDatabase/Emp.models.js"


export const verifyEmpJWT = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies.accessToken
        
        if (!token){
            throw new apiError (401, "Unauthorized Request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const emp= await Emp.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!emp){
            throw new apiError(401, "Invalid Access Token")
        }
    
        req.emp = emp
        
        next()
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Access Token")
    }

})
