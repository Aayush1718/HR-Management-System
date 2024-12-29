import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom';
import { useEmpContext } from '../contexts/EmpContext';

function EmpLogin() {
  
    const [error , setError] = useState(false);
    const [empName , setEmpName] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();
    const {setEmp} = useEmpContext();


    const loginedEmp = async ()=>{
        setError(false);
        try{
            const res = await axios.post('/api/v1/emp/login',{
                empName: empName,
                password: password
            },{
                withCredentials: true
            })
            console.log("Login Successful")
            setEmp(res.data.data.emp._id)
            navigate("/emp-Details")
            
        } catch{
            setError(true)
            console.error("Login failed", error)
        }
    }

    function handleEmpName(e){
        setEmpName(e.target.value)
    }

    function handlePassword(e){
        setPassword(e.target.value)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-violet-200">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4 text-center">Employee Login</h2>
                <input 
                type="text" 
                placeholder="Name" 
                onChange={handleEmpName} 
                className="block w-full p-2 mb-4 border rounded"
                />
                <input 
                type="password" 
                placeholder="Password" 
                onChange={handlePassword} 
                className="block w-full p-2 mb-4 border rounded"
                />
                <button 
                onClick={loginedEmp} 
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                Login
                </button>
                {error && <p className="text-red-500 mt-4">Invalid Name of employee or Password</p>}
            </div>
        </div>
    )
}

export default EmpLogin