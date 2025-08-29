import { createContext, useState, useEffect } from "react";

export const Usercontext = createContext();

export const Usercontextprovider = ({ children }) => {
  const [user, setuser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
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

  return (
    <Usercontext.Provider value={{ user, setuser }}>
      {children}
    </Usercontext.Provider>
  );
};
