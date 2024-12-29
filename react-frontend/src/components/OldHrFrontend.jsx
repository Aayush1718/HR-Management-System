import React, {useState} from "react";
import axios from "axios";

function HrFrontEnd(){
    
    const[Ename,setEName]= useState("");
    const[Edob,setEDob]= useState("");
    const[Eposition,setEPosition]= useState("");
    const[Eworkex,setEWorkEx]= useState();
    const[Edepartment,setEDepartment]= useState("");
    const[Esalary,setESalary]= useState();
    const[fEname , setFEname] = useState([])
    const[error,setError]= useState(false)


    function handleEName(event){
        setEName(event.target.value)
    }

    function handleEDob(event){
        setEDob(event.target.value);
    }
    
    function handleEPosition(event){
        setEPosition(event.target.value);
    }

    function handleEWorkEx(event){
        setEWorkEx(event.target.value);
    }

    function handleESalary(event){
        setESalary(event.target.value);
    }

    function handleEDepartment(event){
        setEDepartment(event.target.value);
    }

    function handleFEname(){

        axios.get('/api/v1/emp/find?name='+ Ename)
            .then((res)=> {
                setError(false)
                console.log(res.data.data);
                setFEname(res.data.data);
            })
            .catch((error)=>{
                console.log(error);
                setError(true)
            })
    }

        
    return(
        <div className="HR-Input-Portal">
            <title>HRMS-HR-FrontEnd</title>
            <h1>HR Input Portal</h1>

            <div className="Input-Cards">
            <p className="Field-Titles">
                Emp Name:</p>
            <input type="Text" 
            value={Ename} 
            onChange={handleEName} 
            className="Input-Box"
            placeholder="Write Here"></input>
            <p>{Ename}</p>
            <button onClick={handleFEname}>Submit</button>
            </div>
            <br />
            
            <div className="Input-Cards">
            <p className="Field-Titles">
                Emp DOB:</p>
            <input type="date" 
            value={Edob} 
            onChange={handleEDob} 
            className="Input-Box"
            placeholder="Write Here"></input>
            <p>{Edob}</p>
            </div>
            <br />

            <div className="Input-Cards">
            <p className="Field-Titles">
                Emp Position:</p>
            <input type="text" 
            value={Eposition} 
            onChange={handleEPosition} 
            className="Input-Box"
            placeholder="Write Here"></input>
            <p>{Eposition}</p>
            </div>
            <br />

            <div className="Input-Cards">
            <p className="Field-Titles">
                Emp WorkEx in years:</p>
            <input type="text" 
            value={Eworkex} 
            onChange={handleEWorkEx} 
            className="Input-Box"
            placeholder="Write Here"></input>
            <p>{Eworkex}</p>
            </div>
            <br />

            <div className="Input-Cards">
            <p className="Field-Titles">
                Emp Salary:</p>
            <input type="number" 
            value={Esalary} 
            onChange={handleESalary} 
            className="Input-Box"
            placeholder="Write Here"></input>
            <p>{Esalary}</p>
            </div>
            <br />

            <div className="Input-Cards">
            <p className="Field-Titles">
                Emp Department:</p>
            <input type="text" 
            value={Edepartment} 
            onChange={handleEDepartment} 
            className="Input-Box"
            placeholder="Write Here"></input>
            <p>{Edepartment}</p>
            </div>
            <br />

            <div className="Input-Cards">
                {
                    error==false && fEname.map((emp,index)=>(
                    <div key={emp._id}>
                        <h3>{emp.empName}</h3>
                    </div>
                    ))
                } 

                {
                    error==true && 
                    <h2>Error in Employee Name</h2>
                }
            </div>

        </div>
    );
}

export default HrFrontEnd;