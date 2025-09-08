import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Capitanprotected({ children }) {
  const [isAuth, setIsAuth] = useState(null); 
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get( 
          `${import.meta.env.VITE_API_URL}/capitans/authcheck`,
         { withCredentials: true }
        );
        if (response.data.loggedin){
          setIsAuth(true);
        } else {
          setIsAuth(false);
          navigate('/capitanlogin');
        }
      } catch (err) {
        console.error('Auth check failed', err);
        setIsAuth(false);
        navigate('/capitanlogin');
      }
    };

    checkAuth();
  }, [navigate]);
  
  return <>{children}</>;
}
export default  Capitanprotected;