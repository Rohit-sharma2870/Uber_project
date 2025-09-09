import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Userlogin from "./pages/Userlogin";
import Usersignup from "./pages/Usersignup";
import Capitanlogin from "./pages/Capitanlogin";
import Capitansignup from "./pages/Capitansignup";
import Logout from "./pages/Logout";
import Capitanhome from "./pages/Capitanhome";
import Capitanprotected from "./pages/Capitanprotected";
import Capitanlogout from "./pages/Capitanlogout";
import Riding from "./pages/Riding";
import Capitanride from "./pages/Capitanride";
import ProtectedRoute from "./pages/Protectedroute";
//comment
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
            <Home />
        }
      />
      <Route
        path="/capitanhome"
        element={
            <Capitanhome />
        }
      />
    </Routes>
  );
}
export default App;
