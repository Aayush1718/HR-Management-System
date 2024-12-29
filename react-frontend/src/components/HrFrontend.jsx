import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function HrFrontend() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [dob, setDob] = useState(new Date())
    const [position, setPosition] = useState('')
    const [workex, setWorkEx] = useState('')
    const [salary, setSalary] = useState('')
    const [department, setDepartment] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(false)
    const [popup, setPopup] = useState(false)

    const navigate = useNavigate()

    async function registerData(e) {
        setError(false);

        try {
            const res = await axios.post('/api/v1/emp/register', {
                empName: name,
                password: password,
                empDob: dob,
                empPosition: position,
                empWorkEx: workex,
                empSalary: salary,
                empDepartment: department,
                empEmail: email
            })
            console.log("Employee Registered", res.data);
            setPopup(true);
        } catch (err) {
            console.log(err);
            setError(true);
            setPopup(false)
        }

    };

    function handleName(e) {
        setName(e.target.value)
    }

    function handlePassword(e) {
        setPassword(e.target.value)
    }

    function handleDob(e) {
        setDob(e.target.value)
    }

    function handlePosition(e) {
        setPosition(e.target.value)
    }

    function handleWorkEx(e) {
        setWorkEx(e.target.value)
    }

    function handleSalary(e) {
        setSalary(e.target.value)
    }

    function handleDepartment(e) {
        setDepartment(e.target.value)
    }

    function handleEmail(e) {
        setEmail(e.target.value)
    }

    function closePopup() {
        setPopup(false)
    }

    function goToHrLeavePortal() {
        navigate("/displayPendingLeavesToHr")
    }

    return (
        <>
            {/* Main Container */}
            <div className="flex flex-col items-center justify-center min-h-screen bg-violet-200">

                {/* Go to HR Leave Portal Button */}
                <button
                    onClick={goToHrLeavePortal}
                    className="absolute top-4 left-4 bg-blue-300 px-4 py-2 text-lg font-semibold rounded-lg shadow-md hover:bg-blue-400 
            transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 
            focus:ring-blue-300 focus:ring-offset-2"
                >
                    Leave Portal
                </button>

                {/* Form Card */}
                <div className="bg-white shadow-sm rounded-2xl p-8 w-full max-w-md hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-3xl font-bold mb-10 text-gray-700 text-center">
                        Register an Employee
                    </h2>

                    {/* Input Fields */}
                    {[
                        { label: "Employee Name", type: "text", onChange: handleName },
                        { label: "Employee Password", type: "password", onChange: handlePassword },
                        { label: "Employee Dob", type: "date", onChange: handleDob },
                        { label: "Employee Position", type: "text", onChange: handlePosition },
                        { label: "Employee WorkEx", type: "text", onChange: handleWorkEx },
                        { label: "Employee Salary", type: "text", onChange: handleSalary },
                        { label: "Employee Department", type: "text", onChange: handleDepartment },
                        { label: "Employee Email", type: "email", onChange: handleEmail },
                    ].map((field, index) => (
                        <div key={index} className="mb-6">
                            <label className="block mb-2 text-lg font-medium text-gray-600">
                                {field.label}
                            </label>
                            <input
                                type={field.type}
                                onChange={field.onChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-600 hover:ring-2 
                shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                                placeholder={`Enter ${field.label}`}
                            />
                        </div>
                    ))}

                    {/* Submit Button */}
                    <button
                        onClick={registerData}
                        className="mt-6 w-full bg-green-300 px-4 py-2 text-lg font-semibold rounded-lg shadow-md hover:bg-green-400 
            transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 
            focus:ring-green-300 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>

                {/* Popup Modal */}
                {popup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center transform transition-all scale-100 duration-300">
                            <h2 className="text-2xl font-semibold text-green-500 mb-4">
                                Employee Registered Successfully!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                The employee has been successfully added to the database.
                            </p>
                            <button
                                onClick={closePopup}
                                className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full hover:from-green-500 
                hover:to-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 
                focus:ring-green-400 focus:ring-opacity-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default HrFrontend