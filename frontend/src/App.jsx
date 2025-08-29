import { Routes,Route } from 'react-router-dom'
import { useState } from 'react'
import Index from './pagess/Index'
import Home from './pagess/Home'
import Userlogin from './pagess/userlogin'
import Usersignup from './pagess/usersignup'
import Capitanlogin from './pagess/capitanlogin'
import Capitansignup from './pagess/Capitansignup'
import ProtectedRoute from './pagess/protectedroute'
import Logout from './pagess/logout'
import Capitanhome from './pagess/Capitanhome'
import Capitanprotected from './pagess/Capitanprotected'
import Capitanlogout from './pagess/Capitanlogout'
import Riding from './pagess/Riding'
import Capitanride from './pagess/Capitanride'

function App() {
  const [count, setCount] = useState(0)
  return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/userlogin" element={<Userlogin/>} />
        <Route path="/capitan-ride" element={<Capitanride/>} />
        <Route path="/usersignup" element={<Usersignup/>} />
        <Route path="/capitanlogin" element={<Capitanlogin/>} />
        <Route path="/capitansignup" element={<Capitansignup/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/capitanlogout" element={<Capitanlogout/>} />
        <Route path="/riding" element={<Riding/>}/>
        <Route path="/Home" element={
          <ProtectedRoute>
          <Home/>
           </ProtectedRoute>
          } />
              <Route path="/capitanhome" element={
                <Capitanprotected>
                <Capitanhome/>
                </Capitanprotected>} />
      </Routes>
  )
}
export default App
             