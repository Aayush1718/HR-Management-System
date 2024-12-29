import React from 'react'
import { useEmpContext } from '../contexts/EmpContext'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function LeavePortal() {
    const { emp } = useEmpContext()
    const [leaveType, setLeaveType] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [popup, setPopup] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate();

    //Applying Leave

    async function ApplyLeave() {
        console.log(emp)
        try {
            const res = await axios.post('/api/v1/leave/registerLeave', {
                emp: emp,
                leaveStatus: 'Pending',
                leaveType: leaveType,
                startDate: startDate,
                endDate: endDate
            })
            console.log("Leave registered")
            setPopup(true)
        } catch (err) {
            console.log(err);
            setError(true);
            setPopup(false)
        }
    }

    function handleLeaveType(e) {
        setLeaveType(e.target.value)
    }

    function handleStartDate(e) {
        setStartDate(e.target.value)
    }

    function handleEnddate(e) {
        setEndDate(e.target.value)
    }

    function closePopup(e) {
        setPopup(false)
        navigate('/emp-Details')
    }

    //Checking Leave Status

    const [lastLeaveType, setLastLeaveType] = useState('')
    const [lastLeaveStatus, setLastLeaveStatus] = useState('')
    const [lastLeaveStartDate, setLastLeaveStartDate] = useState(new Date())
    const [lastLeaveEndDate, setLastLeaveEndDate] = useState(new Date())
    const [showLastLeave , setShowLastLeave] = useState(false)

    async function lastLeave() {
        console.log(emp)
        try {
            const res = await axios.get(`/api/v1/emp/empLeaveStatus?emp=${emp}`)
            setLastLeaveType(res.data.data[0].leaveType)
            setLastLeaveStatus(res.data.data[0].leaveStatus)
            setLastLeaveStartDate(res.data.data[0].startDate)
            setLastLeaveEndDate(res.data.data[0].endDate)
            setShowLastLeave(true)
            
        } catch (err) {
            console.log(err);
            setError(true);
        }

    }

    useEffect(() => {
      lastLeave()
    }, [emp])
    

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-violet-200">
                {/* Form Card */}
                <div className="bg-white shadow-sm rounded-2xl p-8 w-full max-w-md hover:shadow-2xl transition-shadow duration-300">
                    <h2 className="text-3xl font-bold mb-10 text-gray-700 text-center">
                        Apply for Leave
                    </h2>

                    {/* Leave Type */}
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-gray-600">
                            Type of Leave
                        </label>
                        <input
                            type="text"
                            value={leaveType}
                            onChange={handleLeaveType}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-600 hover:ring-2 
                shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                            placeholder="Enter Leave Type"
                        />
                    </div>

                    {/* Start Date */}
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-gray-600">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDate}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-600 hover:ring-2 
                shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                        />
                    </div>

                    {/* End Date */}
                    <div className="mb-6">
                        <label className="block mb-2 text-lg font-medium text-gray-600">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEnddate}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-600 hover:ring-2 
                shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-center mb-4 text-sm font-medium">
                            Please fill out all fields correctly.
                        </div>
                    )}

                    {/* Apply Leave Button */}
                    <button
                        onClick={ApplyLeave}
                        className="mt-6 w-full bg-green-300 px-4 py-2 text-lg font-semibold rounded-lg shadow-md hover:bg-green-400 
              transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 
              focus:ring-green-300 focus:ring-offset-2"
                    >
                        Apply Leave
                    </button>
                </div>

                {/* Last Leave Details */}
                {showLastLeave && (
                    <div className="mt-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white mb-4">
                        <h3 className="text-2xl font-semibold mb-3 text-gray-700 text-center">
                            Last Leave
                        </h3>
                        <p className="text-gray-600 text-lg">
                            <strong>Leave Type:</strong> {lastLeaveType}
                        </p>
                        <p className="text-gray-600 text-lg">
                            <strong>Status:</strong> {lastLeaveStatus}
                        </p>
                        <p className="text-gray-600 text-lg">
                            <strong>Start Date:</strong> {new Date(lastLeaveStartDate).toLocaleDateString('en-GB')}
                        </p>
                        <p className="text-gray-600 text-lg">
                            <strong>End Date:</strong> {new Date(lastLeaveEndDate).toLocaleDateString('en-GB')}
                        </p>
                    </div>
                )}

                {/* Popup Modal */}
                {popup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm text-center transform transition-all scale-100 duration-300">
                            <h2 className="text-2xl font-semibold text-green-500 mb-4">
                                Leave Applied Successfully!
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Your leave request has been submitted successfully.
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

export default LeavePortal