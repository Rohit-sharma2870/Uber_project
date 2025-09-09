import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capitancontext } from "../contexts/capitancontent";

function Capitanprotected({ children }) {
  const { capitan } = useContext(Capitancontext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!capitan || !capitan.email) {
      navigate("/capitanlogin");
    }
  }, [capitan, navigate]);

  // Show loading while checking auth
  if (!capitan || !capitan.email) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
export default Capitanprotected;
