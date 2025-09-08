import React from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Capitanlogout() {
   const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/capitans/logout`,{
          withCredentials: true,
        });
        if (response.status === 200) {
          navigate('/capitanlogin');
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
    logout();
  }, [navigate]);
}
export default Capitanlogout
