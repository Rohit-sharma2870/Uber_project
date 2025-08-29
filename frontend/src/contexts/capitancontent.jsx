import { createContext, useState } from "react";
import { useEffect } from "react";
 export const Capitancontext=createContext()

export  const Capitancontextprovider=({children})=>{
    const[capitan,setcapitan]=useState(null)
    const[isloading,setloading]=useState(false)
    const[error,seterror]=useState(null)
    const updatecapitan=(capitandata)=>{
        setcapitan(capitandata);      
    };
    const values={
            capitan,
            setcapitan,
            isloading,
            setloading,
            error,
            seterror,
            updatecapitan
        }
        
          // Load user from localStorage when app starts
          useEffect(() => {
            const storedUser = localStorage.getItem("capitan");
            if (storedUser) {
              setcapitan(JSON.parse(storedUser));
            }
          }, []);

          // Save capitan  to localStorage whenever it changes
          useEffect(() => {
            if (capitan && capitan.email) {
              localStorage.setItem("capitan", JSON.stringify(capitan));
            } else {
              localStorage.removeItem("capitan");
            }
          }, [capitan]);
 return(  
 <Capitancontext.Provider value={values}>
        {children}
    </Capitancontext.Provider>
    )
}