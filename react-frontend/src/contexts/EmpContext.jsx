import { useState , useContext , createContext, Children } from "react";

const EmpContext = createContext();

export const EmpContextProvider = ({children}) => {
    const [emp , setEmp] = useState(null);
    return(
        <EmpContext.Provider value={{emp,setEmp}}>
            {children}
        </EmpContext.Provider>
    )
}

export const useEmpContext = ()=>{
    return(useContext(EmpContext))
}