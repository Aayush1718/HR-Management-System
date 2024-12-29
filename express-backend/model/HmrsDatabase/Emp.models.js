import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const empSchema = new mongoose.Schema({
    
    empName: { 
        type : String ,
        required : [true , "This field is required"] ,
    },

    empDob: {
        type : Date ,
        required : [true , "This field is required"] ,
        lowercase : true ,        
    },

    empPosition: {
        type : String,
        required : [true , "This field is required"] ,
    },

    empWorkEx: {
        type : Number,
        required : [true , "This field is required"] ,
    },

    empSalary: {
        type : Number,
        required : [true , "This field is required"] ,
    },

    empDepartment: {
        type : String,
        required : [true , "This field is required"] ,
    },

    empEmail: {
        type : String,
        required : [true , "This field is required"] ,
    },
    password: {
        type: String,
        required : [true , "This field is required"] ,
    },
    refreshToken: {
        type: String,
    }

}, {timestamps: true});

empSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10);
    next()
})

empSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

empSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            empName: this.empName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

empSchema.methods.generateRefreshToken = function () {
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


export const Emp = mongoose.model("Emp" , empSchema);

