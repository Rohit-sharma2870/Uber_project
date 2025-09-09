import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Usercontext } from "../contexts/usercontext";

function ProtectedRoute({ children }) {
  const { user } = useContext(Usercontext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.email) {
      navigate("/userlogin");
    }
  }, [user, navigate]);

  if (!user || !user.email) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
export default ProtectedRoute;


