import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pagess/Index";
import Home from "./pagess/Home";
import Userlogin from "./pagess/Userlogin";
import Usersignup from "./pagess/Usersignup";
import Capitanlogin from "./pagess/Capitanlogin";
import Capitansignup from "./pagess/Capitansignup";
import Logout from "./pagess/Logout";
import Capitanhome from "./pagess/Capitanhome";
import Capitanprotected from "./pagess/Capitanprotected";
import Capitanlogout from "./pagess/Capitanlogout";
import Riding from "./pagess/Riding";
import Capitanride from "./pagess/Capitanride";
import ProtectedRoute from "./pagess/Protectedroute";

function App() {
  const [count, setCount] = useState(0);
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/userlogin" element={<Userlogin />} />
      <Route path="/capitan-ride" element={<Capitanride />} />
      <Route path="/usersignup" element={<Usersignup />} />
      <Route path="/capitanlogin" element={<Capitanlogin />} />
      <Route path="/capitansignup" element={<Capitansignup />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/capitanlogout" element={<Capitanlogout />} />
      <Route path="/riding" element={<Riding />} />
      <Route
        path="/Home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/capitanhome"
        element={
          <Capitanprotected>
            <Capitanhome />
          </Capitanprotected>
        }
      />
    </Routes>
  );
}
export default App;
