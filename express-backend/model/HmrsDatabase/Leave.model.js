import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    emp:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Emp",
        required : [true , "This field is required"]  
    },
    leaveStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
        required : [true , "This field is required"]
    },
    leaveType: {
        type: String,
        required : [true , "This field is required"]
    },
    startDate: {
        type: Date,
        required : [true , "This field is required"]
    },
    endDate: {
        type: Date,
        required : [true , "This field is required"]
    }
},{timestamps: true})

export const Leave = mongoose.model("Leave" , leaveSchema);