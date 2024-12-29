import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {Emp} from "../model/HmrsDatabase/Emp.models.js"
import { Leave } from "../model/HmrsDatabase/Leave.model.js"
import mongoose from "mongoose"

const registerLeave = asyncHandler(async(req, res) => {
    const {emp,leaveStatus,leaveType,startDate,endDate} = await req.body;

    if (emp==""){
        throw new apiError(400, "emp is required");
    };

    if (leaveType==""){
        throw new apiError(400, "leaveType is required");
    };

    if (startDate==""){
        throw new apiError(400, "startDate is required");
    };

    if (endDate==""){
        throw new apiError(400, "endDate is required");
    };

    const existingLeave = await Leave.findOne({
        emp : emp,
        leaveStatus: "Pending"
    }).populate({
        path : 'emp',
        select : '-password -refreshToken'
    })
    if (existingLeave){
        throw new apiError(409, "Cannot apply a leave when another leave is pending");
    };

    const leave = await Leave.create({
        emp,
        leaveStatus,
        leaveType,
        startDate,
        endDate
    });

    const registeredLeave = await Leave.find({emp: leave.emp , startDate : leave.startDate})
    if (!registeredLeave){
        throw new apiError(500, "Error in registering leave")
    };

    return res.status(201).json(
        new apiResponse(200, registerLeave , "Leave registered successfully")
    );
})

export {registerLeave};



