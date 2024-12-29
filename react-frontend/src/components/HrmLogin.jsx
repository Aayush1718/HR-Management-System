import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom';

function HrmLogin() {

    const [error , setError] = useState(false);
    const [hrmName , setHrmName] = useState("");
    const [hrmPassword , setHrmPassword] = useState("");
    const navigate = useNavigate();
  
    const loginedHrm = async ()=>{
        setError(false);
        try{
            const res = await axios.post('/api/v1/hrm/login',{
                hrmName: hrmName,
                hrmPassword: hrmPassword
            },{
                withCredentials: true
            })
            console.log("Login Successful")
            navigate('/register-Emp')
        } catch{
            setError(true)
            console.error("Login failed", error)
        }
    }

    function handleHrmName(e){
        setHrmName(e.target.value)
    }

    function handleHrmPassword(e){
        setHrmPassword(e.target.value)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-violet-200">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-xl font-bold mb-4 text-center">HR Manager Login</h2>
                <input 
                type="text" 
                placeholder="Name" 
                onChange={handleHrmName} 
                className="block w-full p-2 mb-4 border rounded"
                />
                <input 
                type="password" 
                placeholder="Password" 
                onChange={handleHrmPassword} 
                className="block w-full p-2 mb-4 border rounded"
                />
                <button 
                onClick={loginedHrm} 
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                Login
                </button>
                {error && <p className="text-red-500 mt-4">Invalid Name of HR Manager or Password</p>}
            </div>
        </div>
    )
}

export default HrmLogin