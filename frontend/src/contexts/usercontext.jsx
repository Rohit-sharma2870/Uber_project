import { createContext, useState, useEffect } from "react";
// Create the context
export const Usercontext = createContext();
// Provider component
export const Usercontextprovider = ({ children }) => {
  const [user, setuser] = useState(null); 
  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser){
      setuser(JSON.parse(storedUser));
    }
  }, []);
  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const values = { user, setuser };
  return (
    <Usercontext.Provider value={values}>
      {children}
    </Usercontext.Provider>
  );
};

