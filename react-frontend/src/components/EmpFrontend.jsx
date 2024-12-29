import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


function EmpFrontend() {

  const [name, setName] = useState("")
  const [searchName, setSearchName] = useState([])
  const [error, setError] = useState(false)
  const navigate = useNavigate();

  async function getData() {
    setError(false);
    try {
      const res = await axios.get(`/api/v1/emp/find?name=${name}`);

      console.log(res.data.data);
      setSearchName(res.data.data);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  function handleName(e) {
    setName(e.target.value)
  }

  function dateFormatter(dob) {
    const formattedDate = new Date(dob);
    return formattedDate.toLocaleString('en-GB');
  }

  function navigateToCalender() {
    navigate('/emp-Calender')
  }

  function leavePortal(){
    navigate('/emp-LeavePortal')
  }

  return (
    <>
      <div className="flex flex-col items-center h-screen bg-gradient-to-r from-purple-200 to-violet-300 overflow-auto">

        <div className="flex flex-col items-center bg-white p-8 rounded-3xl shadow-lg mt-20 w-full max-w-md transform transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Enter your name 
          </h2>

          <input
            type="text"
            id="name"
            onChange={handleName}
            className="w-full p-4 border-2 border-gray-300 rounded-lg shadow-sm text-lg placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent mb-6"
            placeholder="Enter your Name"
          />

          <button
            onClick={getData}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white text-lg font-semibold rounded-lg shadow-md transform hover:scale-105 transition duration-300 hover:from-green-500 hover:to-green-600"
          >
            Submit
          </button>
        </div>

        <div className="px-6 mt-8 space-y-6">
          {error === false &&
            searchName.map((emp) => (
              <div
                key={emp._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Name: <span className="font-normal">{emp.empName}</span>
                </h3>
                <h3 className="text-lg text-gray-700 mb-1">
                  Date of Birth: <span className="font-normal">{dateFormatter(emp.empDob)}</span>
                </h3>
                <h3 className="text-lg text-gray-700 mb-1">
                  Position: <span className="font-normal">{emp.empPosition}</span>
                </h3>
                <h3 className="text-lg text-gray-700 mb-1">
                  Work Experience: <span className="font-normal">{emp.empWorkEx}</span>
                </h3>
                <h3 className="text-lg text-gray-700 mb-1">
                  Salary: <span className="font-normal">{emp.empSalary}</span>
                </h3>
                <h3 className="text-lg text-gray-700 mb-1">
                  Department: <span className="font-normal">{emp.empDepartment}</span>
                </h3>
                <h3 className="text-lg text-gray-700 mb-1">
                  Email: <span className="font-normal">{emp.empEmail}</span>
                </h3>
              </div>
            ))}

          {error === true && (
            <h2 className="text-center text-red-500 text-xl font-semibold">
              Error in Employee Name
            </h2>
          )}
        </div>

        <button
          onClick={navigateToCalender}
          className="mt-8 bg-gradient-to-r from-blue-400 to-blue-500 px-6 py-3 rounded-lg text-white text-lg font-semibold shadow-md transform hover:scale-105 transition duration-300 hover:from-blue-500 hover:to-blue-600"
        >
          Holidays
        </button>

        <button
          onClick={leavePortal}
          className="mb-8 mt-8 bg-gradient-to-r from-green-400 to-green-500 px-6 py-3 rounded-lg text-white text-lg font-semibold shadow-md transform hover:scale-105 transition duration-300 hover:from-green-500 hover:to-green-600"
        >
          Leave Portal
        </button>

      </div>
    </>
  )
}

export default EmpFrontend