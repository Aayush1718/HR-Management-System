import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const hrmSchema = new mongoose.Schema({
    hrmName: { 
        type : String ,
        required : [true , "This field is required"] ,
    },
    hrmPassword: {
        type: String,
        required : [true , "This field is required"] ,
    },
    refreshToken: {
        type: String,
    }
}, {timestamps: true})

hrmSchema.pre('save', async function(next){
    if(!this.isModified("hrmPassword")){
        return next();
    }
    this.hrmPassword=await bcrypt.hash(this.hrmPassword,10);
    next()
})

hrmSchema.methods.isPasswordCorrect = async function (hrmPassword) {
    return await bcrypt.compare(hrmPassword, this.hrmPassword)
}

hrmSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            hrmName: this.hrmName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

hrmSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Hrm = mongoose.model("Hrm" , hrmSchema);
