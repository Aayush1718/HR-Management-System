import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HrLeavePortal() {
    const [leaves, setLeaves] = useState([]);
    const [error, setError] = useState(false);

    async function displayLeavePortal() {
        try {
            const res = await axios.get(`/api/v1/hrm/displayPendingLeaves`);
            setLeaves(res.data.data.map((leave) => ({ ...leave, statusUpdated: false }))); // Add statusUpdated field
            setError(false);
            console.log('Successfully retrieved pending leaves');
        } catch (err) {
            console.log(err);
            setError(true);
        }
    }

    async function approveLeave(leaveId) {
        try {
            await axios.post(`/api/v1/hrm/approveLeaves`, { emp: leaveId });
            console.log('Approved leave successfully');
            setLeaves((prevLeaves) =>
                prevLeaves.map((leave) =>
                    leave.emp._id === leaveId ? { ...leave, statusUpdated: true } : leave
                )
            );
        } catch (err) {
            console.log(err);
        }
    }

    async function rejectLeave(leaveId) {
        try {
            await axios.post(`/api/v1/hrm/rejectLeaves`, { emp: leaveId });
            console.log('Rejected leave successfully');
            setLeaves((prevLeaves) =>
                prevLeaves.map((leave) =>
                    leave.emp._id === leaveId ? { ...leave, statusUpdated: true } : leave
                )
            );
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        displayLeavePortal();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-2xl font-bold mb-6">Pending Leaves</h1>

            {error && <p className="text-red-500 mb-4">Failed to load pending leaves.</p>}

            {leaves.length > 0 ? (
                <ul className="space-y-4">
                    {leaves.map((leave) => (
                        <li
                            key={leave.emp._id}
                            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                        >
                            <p>
                                <strong>Name of Employee:</strong> {leave.emp.empName}
                            </p>
                            <p>
                                <strong>Leave Type:</strong> {leave.leaveType}
                            </p>
                            <p>
                                <strong>Start Date:</strong>{' '}
                                {new Date(leave.startDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>End Date:</strong>{' '}
                                {new Date(leave.endDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Status:</strong> {leave.leaveStatus}
                            </p>

                            <div className="mt-4 flex space-x-4">
                                <button
                                    onClick={() => approveLeave(leave.emp._id)}
                                    className={`px-4 py-2 rounded-md font-semibold text-white ${leave.statusUpdated
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                    disabled={leave.statusUpdated}
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() => rejectLeave(leave.emp._id)}
                                    className={`px-4 py-2 rounded-md font-semibold text-white ${leave.statusUpdated
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                    disabled={leave.statusUpdated}
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No pending leaves found.</p>
            )}
        </div>
    );
}

export default HrLeavePortal;



