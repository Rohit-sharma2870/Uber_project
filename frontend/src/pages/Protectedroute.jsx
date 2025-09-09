import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function ProtectedRoute({ children }) {
  // const [isAuth, setIsAuth] = useState(null);
  // const navigate = useNavigate();
  // useEffect(() =>{
  //   const checkAuth = async () =>{
  //     try{
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_API_URL}/users/authcheck`,
  //         { withCredentials: true }
  //       );
  //       if (response.data.loggedin){
  //         setIsAuth(true);
  //       } else{
  //         setIsAuth(false);
  //         navigate('/userlogin');
  //       }
  //     } catch (err){
  //       console.error('Auth check failed', err);
  //       setIsAuth(false);
  //       navigate('/userlogin');
  //     }
  //   };
  //   checkAuth();
  // }, [navigate]);
  return <>{children}</>;
}
export default ProtectedRoute;
