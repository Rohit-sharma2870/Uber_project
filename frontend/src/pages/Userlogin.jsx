import React, { useRef, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Usercontext } from '../contexts/usercontext' 
function Userlogin() {
  const navigate = useNavigate()
  const email = useRef()
  const password = useRef()
  const [userdata, setuserdata] = useState({})
  const { setuser } = useContext(Usercontext) 
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        { email: email.current.value, password: password.current.value},
        {withCredentials: true} 
      )
      console.log('Login success:',response.data)
      setuserdata(response.data)
      setuser(response.data)
      localStorage.setItem("user", JSON.stringify(response.data))
      navigate('/home')
    } catch (error) {
      if (error.response) {
        console.error('Backend validation or login error:', error.response.data)
      } else {
        console.error('Error:', error.message)
      }
    }
  }

  return (
    <div className='h-screen flex flex-col p-8 mt-8'>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <h3 className='text-2xl mb-2 font-medium'>Enter your email here:</h3>
        <input
          type="email"
          ref={email}
          required
          placeholder='example@gmail.com'
          className='w-full rounded px-2 py-3 border mt-2 bg-white placeholder:text-lg text-lg'
        />

        <h3 className='text-2xl mb-2 font-medium mt-6'>Enter your password here:</h3>
        <input
          type="password"
          ref={password}
          required
          placeholder='Enter your password here'
          className='w-full rounded px-2 py-3 border mt-2 bg-white placeholder:text-lg text-lg'
        />

        <button className='w-full px-4 py-3 text-white bg-black rounded-lg mt-6 text-xl'>
          Login
        </button>
      </form>

      <h3 className='mt-4 text-lg ml-12'>
        New here? <Link to='/usersignup' className='underline text-blue-500'>Create your account</Link>
      </h3>
      <Link
        to='/capitanlogin'
        className='w-full py-3 rounded bg-green-600 text-xl flex items-center mt-80 justify-center font-medium'
      >
        Sign in as a Captain
      </Link>
    </div>
  )
}
export default Userlogin

