import React, { useContext, useEffect, useState } from "react";
import Google from "../assets/Google";
import axios from "axios";
import api from "../api";
import {toast } from "react-toastify";
// import { SwitchSignUp } from "../context.js";

const SignUp = ({ setSignInOrSignUp, setOpenSignIn }) => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const notifySuccess = (message) => toast.success(message, {
        theme: "dark"
    });
    const notifyError = (error) => toast.error(error, {
        theme: "dark"
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const response = await api.post("/user/signup", formData);
        console.log(response.data);
        setMessage("Sign up successful");
        notifySuccess("Sign up successful");
        setSignInOrSignUp("signIn");

    } catch(error){
        console.log(error);
        setError(error.message);
        notifyError(error.response.data.message);
    }
  }
  return (
    <div
      className={` fixed flex items-center justify-center z-50 w-fit h-fit left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] transition-all duration-500`}
    >
      <div className=" bg-darkBg text-white rounded-lg p-6 w-96 relative shadow-md">
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={() => {
            setOpenSignIn(false);
          }}
        >
          &times;
        </button>

        <h2 className="text-center text-xl font-bold mb-4">
          Sign Up - Create an account
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className=" text-xs font-normal text-white text-opacity-80">What's your Email?</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="w-full px-4 py-2 mb-7  rounded mt-1 outline outline-gray-400 outline-1 focus:ring-2 focus:ring-gray bg-transparent text-white"
            required
          />
          <label htmlFor="username" className=" text-xs font-normal text-white text-opacity-80">What should we call you?</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
            className="w-full px-4 py-2 mb-7 rounded mt-1 outline outline-gray-400 outline-1 focus:ring-2 focus:ring-gray bg-transparent text-white"
            required
          />
          <label htmlFor="password" className=" text-xs font-normal text-white text-opacity-80">Create a password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="w-full px-4 py-2 mb-7 rounded mt-1 outline outline-gray-400 outline-1 focus:ring-2 focus:ring-gray bg-transparent text-white"
            required
          />

          <button type="submit" className="w-full bg-gray-300 text-black py-2 rounded font-semibold mb-4">
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-between mb-4">
          <hr className="w-2/5 border-gray-600" />
          <span className="text-sm text-gray-400">or</span>
          <hr className="w-2/5 border-gray-600" />
        </div>

        <button className="w-full bg-white text-black py-2 rounded flex items-center justify-center gap-2 font-semibold">
          <Google />
          Sign in with Google
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Already have an account? {""}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setSignInOrSignUp("signIn")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;