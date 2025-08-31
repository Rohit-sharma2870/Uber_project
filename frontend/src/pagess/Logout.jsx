
import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          navigate('/userlogin');
        }
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    logout();
  }, [navigate]);
}

export default Logout;

