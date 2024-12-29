import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import { Hrm } from "../model/HmrsDatabase/Hrm.models.js"
import { Leave } from "../model/HmrsDatabase/Leave.model.js"

const generateAccessAndRefreshTokens = async(hrmId) => {
    try{
        const hrm = await Hrm.findById(hrmId)
        const accessToken = hrm.generateAccessToken()
        const refreshToken = hrm.generateRefreshToken()

        hrm.refreshToken = refreshToken
        await hrm.save({validateBeforeSave: false})

        return{accessToken,refreshToken};

    } catch{
        throw new apiError(500,"something went wrong while generating access and refresh tokens")
    }
}

const registerHrm = asyncHandler(async (req,res)=> {
    const {hrmName,hrmPassword} = await req.body

    if (hrmName===""){
        throw new apiError(400, "Name of HR Manager is required");
    }

    if (hrmPassword===""){
        throw new apiError(400,"Password of HR Manager is required");
    }

    const existingHrm = await Hrm.findOne({hrmName})
    if (existingHrm){
        throw new apiError(409, "HR Manager with this name already exits");
    }

    const hrm = await Hrm.create({
        hrmName,
        hrmPassword
    })

    const hrmCreated = await Hrm.findById(hrm._id).select("-hrmPassword -refreshToken")

    if (!hrmCreated){
        throw new apiError(500,"Error while registering the HR Manager in Database");
    }

    return res.status(201).json(
        new apiResponse(200, hrmCreated , "Employee registered successfully")
    );
})

export {registerHrm}

const loginHrm = asyncHandler(async(req,res)=>{
    const {hrmName , hrmPassword} = req.body
    if (!hrmName){
        throw new apiError(400,"Name of HR Manager is required")
    }
    const hrm = await Hrm.findOne({hrmName})
    if(!hrm){
        throw new apiError(404,"HR Manager does not exist")
    }
    
    const isPasswordValid = await hrm.isPasswordCorrect(hrmPassword)

    if(!isPasswordValid){
        throw new apiError(404, "User credentials are invalid")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(hrm._id)

    const loggedInHrm = await Hrm.findById(hrm._id).select("-hrmPassword -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
              .cookie("accessToken" , accessToken , options)
              .cookie("refreshToken", refreshToken , options)
              .json(
                new apiResponse(
                    200,
                    {
                        _id: loggedInHrm , accessToken ,refreshToken
                    },
                    "HR Manager logged in successfully"
                )
              )
})

export {loginHrm}

const logoutHrm = asyncHandler( async (req,res) => {
    await Hrm.findByIdAndUpdate(
        req.hrm._id,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true
        }
        
    )  
    
    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200)
              .clearCookie("accessToken", options)
              .clearCookie("refreshToken", options)
              .json(new apiResponse(200, {} , "User logged out successfully"))
})

export{logoutHrm}

const refreshAccessToken = asyncHandler( async (req,res) => {
    const incomingRefreshToken = await req.cookies.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401 , "Unauthorized Request")
    }

    const decodedRefreshToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

    const hrm = await Hrm.findById(decodedRefreshToken?._id)

    if(!hrm){
        throw new apiError(404 , 'HR Manager not found')
    }

    if(decodedRefreshToken!== hrm?.refreshToken){
        throw new apiError(401 , "Refresh token is expired")
    }

    const options = {
        httpOnly : true,
        secure : true
    }

    const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens(hrm._id)

    return res.status(200)
              .cookie("accessToken", accessToken ,options)
              .cookie("refreshToken", newRefreshToken,options)
              .json(
                  new apiResponse(
                    200,
                    {accessToken , refreshToken : newRefreshToken},
                    "Access Token refreshed"
                  )  
              )
})

export{refreshAccessToken}

const displayPendingLeaves = asyncHandler( async ( req , res ) => {
    const pendingLeaves = await Leave.find({leaveStatus : { $regex: /^pending$/i }}).populate({
        path: 'emp',
        select: '-password -refreshToken'
    });

    if (!pendingLeaves){
        console.log("No pending leaves found")
    }

    return res.status(200).json(
        new apiResponse(200 , pendingLeaves , ` ${pendingLeaves.length} Pending leaves found successfully`)
    )
});

export {displayPendingLeaves};

const approveLeave = asyncHandler( async (req,res) => {
    const {emp} = req.body;

    const approvedLeave = await Leave.findOneAndUpdate(
        {emp : emp , leaveStatus: "Pending"},
        { $set: { leaveStatus: 'Approved' } },
        { new: true , runValidators: true}
    );

    if (!approvedLeave){
        throw new apiError(404 , "Leave not found")
    }

    return res.status(201).json(
        new apiResponse(200, approvedLeave , "Leave approved successfully")
    )

})

export {approveLeave}

const rejectLeave = asyncHandler( async (req,res) => {
    const {emp} = req.body;

    const rejectedLeave = await Leave.findOneAndUpdate(
        {emp : emp , leaveStatus: "Pending"},
        { $set: { leaveStatus: 'Rejected' } },
        { new: true , runValidators: true}
    );

    if (!rejectedLeave){
        throw new apiError(404 , "Leave not found")
    }

    return res.status(201).json(
        new apiResponse(200, rejectedLeave , "Leave rejected successfully")
    )

})

export {rejectLeave}

const displayApprovedLeaves = asyncHandler( async ( req , res ) => {
    const approvedLeaves = await Leave.find({leaveStatus : { $regex: /^approved$/i }}).populate({
        path: 'emp',
        select: '-password -refreshToken'
    });

    if (!approvedLeaves){
        console.log("No approved leaves found")
    }

    return res.status(200).json(
        new apiResponse(200 , approvedLeaves , ` ${approvedLeaves.length} approved leaves found successfully`)
    )
});

export {displayApprovedLeaves};

const displayRejectedLeaves = asyncHandler( async ( req , res ) => {
    const rejectedLeaves = await Leave.find({leaveStatus : { $regex: /^rejected$/i }}).populate({
        path: 'emp',
        select: '-password -refreshToken'
    });

    if (!rejectedLeaves){
        console.log("No rejected leaves found")
    }

    return res.status(200).json(
        new apiResponse(200 , rejectedLeaves , ` ${rejectedLeaves.length} rejected leaves found successfully`)
    )
});

export {displayRejectedLeaves};