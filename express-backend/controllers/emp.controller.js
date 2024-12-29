import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { Emp } from "../model/HmrsDatabase/Emp.models.js"
import { Leave } from "../model/HmrsDatabase/Leave.model.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const emp = await Emp.findById(userId)
        const accessToken = emp.generateAccessToken()
        const refreshToken = emp.generateRefreshToken()

        emp.refreshToken = refreshToken
        await emp.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };

    } catch {
        throw new apiError(500, "something went wrong while generating access and refresh tokens")
    }
}


const registerEmp = asyncHandler(async (req, res) => {

    //get emp details from frontend

    const { empName, empDob, empPosition, empWorkEx, empSalary, empDepartment, empEmail, password } = await req.body

    //validate(not empty) 

    if (empName === "") {
        throw new apiError(400, "Name of employee is required");
    }

    if (empDob === "") {
        throw new apiError(400, "Dob of employee is required");
    }

    if (empPosition === "") {
        throw new apiError(400, "Position of employee is required");
    }

    if (empWorkEx == "") {
        throw new apiError(400, "WorkEx of employee is required");
    }

    if (empSalary == "") {
        throw new apiError(400, "Salary of employee is required");
    }

    if (empDepartment === "") {
        throw new apiError(400, "Department of employee is required");
    }

    if (empEmail === "") {
        throw new apiError(400, "Email of Employee is required");
    }

    if (password === "") {
        throw new apiError(400, "Password of Employee is required");
    }


    //check if emp already exists

    const existingEmp = await Emp.findOne({ empEmail })
    if (existingEmp) {
        throw new apiError(409, "Emp with this email already exits");
    }

    //create emp object and create entry in db

    const emp = await Emp.create({
        empName,
        empDob,
        empPosition,
        empWorkEx,
        empSalary,
        empDepartment,
        empEmail,
        password
    })

    //check for emp creation

    const empCreated = await Emp.findById(emp._id).select("-password -refreshToken")

    if (!empCreated) {
        throw new apiError(500, "Error while registering the employee in Database");
    }

    //return res

    return res.status(201).json(
        new apiResponse(200, empCreated, "Employee registered successfully")
    );

});

export { registerEmp };

const displayEmp = asyncHandler(async (req, res) => {
    const findEmpName = await req.query.name;

    const foundEmpName = await Emp.find({ empName: { $regex: findEmpName, $options: "i" } });

    if (foundEmpName.length === 0) {
        return res.status(400).json({
            message: `Employee by name ${findEmpName} not found`
        });
    }

    return res.status(200).json({
        status: 200,
        data: foundEmpName,
        message: "Employee found successfully"
    });
});

export { displayEmp };

const loginEmp = asyncHandler(async (req, res) => {
    const { empName, password } = req.body
    if (!empName) {
        throw new apiError(400, "Name of Employee is required")
    }
    const emp = await Emp.findOne({ empName })
    if (!emp) {
        throw new apiError(404, "Employee does not exist")
    }

    const isPasswordValid = await emp.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(404, "User credentials are invalid")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(emp._id)

    const loggedInEmp = await Emp.findById(emp._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    emp: loggedInEmp, accessToken, refreshToken
                },
                "Employee logged in successfully"
            )
        )
})

export { loginEmp }

const logoutEmp = asyncHandler(async (req, res) => {
    await Emp.findByIdAndUpdate(
        req.emp._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }

    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"))
})

export { logoutEmp }

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = await req.cookies.refreshToken

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized Request")
    }

    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const emp = await Emp.findById(decodedRefreshToken?._id)

    if (!emp) {
        throw new apiError(404, 'Employee not found')
    }

    if (decodedRefreshToken !== emp?.refreshToken) {
        throw new apiError(401, "Refresh token is expired")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(emp._id)

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access Token refreshed"
            )
        )
})

export { refreshAccessToken }

const getEmpLeave = asyncHandler(async (req, res) => {
    const emp  = await req.query.emp
    console.log(emp)
    const empLeave = await Leave.find({ emp: emp })
        .sort({createdAt: -1})
        .limit(1)
        .populate({
            path: 'emp',
            select: "-password -refreshToken"
        })

    if (empLeave.length===0) {
        throw new apiError(404, "No last leave found for this employee")
    }

    return res.status(201).json(
        new apiResponse(200, empLeave, "Last leave for this employee found successfully")
    )

})

export { getEmpLeave }

const deleteAppliedleave = asyncHandler(async (req, res) => {
    const { emp } = req.body

    const deletedLeave = await Leave.deleteOne({ emp: emp })

    if (!deletedLeave) {
        throw new apiError(404, "Applied leave does not exist")
    }

    return res.status(201).json(
        new apiResponse(200, deletedLeave, "Leave deleted successfully")
    )

})

export { deleteAppliedleave }