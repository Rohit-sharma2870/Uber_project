import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Usersignup() {
  const navigate = useNavigate();
  const firstname = useRef();
  const lastname = useRef();
  const email = useRef();
  const password = useRef();
  const [error, setError] = useState(null);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const newuser = {
      firstname: firstname.current.value,
      lastname: lastname.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        newuser,
        { withCredentials: true }
      );

      // Save user info (optional: store in localStorage)
      localStorage.setItem("user", JSON.stringify(response.data));

      // Navigate to home after successful signup
      navigate("/home");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex flex-col p-8 mt-8">
      <form onSubmit={handlesubmit} className="flex flex-col">
        <h3 className="text-2xl mb-2 font-medium">What's your name:</h3>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            ref={firstname}
            required
            placeholder="first name"
            className="w-1/2 rounded px-2 py-3 border mt-2 bg-white placeholder:text-lg text-lg"
          />
          <input
            type="text"
            ref={lastname}
            required
            placeholder="last name"
            className="w-1/2 rounded px-2 py-3 border mt-2 bg-white placeholder:text-lg text-lg"
          />
        </div>

        <h3 className="text-2xl mb-2 mt-2 font-medium">Enter your email here:</h3>
        <input
          type="email"
          ref={email}
          required
          placeholder="example@gmail.com"
          className="w-full rounded px-2 py-3 border mt-2 bg-white placeholder:text-lg text-lg"
        />

        <h3 className="text-2xl mb-2 font-medium mt-6">Enter your password here:</h3>
        <input
          type="password"
          ref={password}
          required
          placeholder="Enter your password here"
          className="w-full rounded px-2 py-3 border mt-2 bg-white placeholder:text-lg text-lg"
        />

        <button className="w-full px-4 py-3 text-white bg-black rounded-lg mt-6 text-xl">
          Signup User
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>

      <h3 className="mt-4 text-lg ml-6">
        Already have an account?
        <Link to="/userlogin" className="underline text-blue-500">
          please login
        </Link>
      </h3>
    </div>
  );
}

export default Usersignup;
