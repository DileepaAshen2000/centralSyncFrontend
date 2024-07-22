import React, { useState } from "react";
import inventory from "../../assests/inventory.jpg";
import { useNavigate } from "react-router-dom";
import LoginService from "./LoginService";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await LoginService.login(email, password);
      console.log(userData);
      if (userData.token) {
        if (userData.status === "INACTIVE") {
          Swal.fire({
            icon: 'error',
            title: 'Account Inactive',
            text: "Sorry, you can't log into centralSync",
          });
          return;
        }

        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        localStorage.setItem('userId', userData.userId);
        localStorage.setItem('workSite', userData.workSite);
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'You have successfully logged in!',
        }).then(() => {
               // Navigate based on role
               switch (userData.role) {
                case 'ADMIN':
                  navigate('/admin-dashboard');
                  break;
                case 'REQUEST_HANDLER':
                  navigate('/request-handler-dashboard');
                  break;
                case 'EMPLOYEE':
                  navigate('/employee-dashboard');
                  break;
                default:
                  navigate('/default-dashboard'); // Fallback case if role is not recognized
              } // Navigate to desired location after successful login
      });
    } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password!',
        })
        setError(userData.error);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <div className="grid grid-cols-1 m-auto md:grid-cols-2 h-[500px] shadow-lg shadow-gray-600 sm:max-w-[900px]">
        <div className="hidden mt-[100px] md:block">
          <img className="w-full " src={inventory} alt="/" />
        </div>

        <div className="flex flex-col justify-around p-16 bg-blue-300">
          <form onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold text-center mb-14">Login</h1>
            {error && <p className="text-red-600">{error.message}</p>}{" "}
            {/* Fixed class name */}
            <h4 className="mb-8">
              Please enter your login details to sign in.
            </h4>
            <div className="flex flex-col gap-2">
              <input
                className="p-2 border"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="User email"
              />
              <input
                className="p-2 border"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <button
              className="w-full py-2 my-4 text-white bg-blue-600 hover:bg-blue-500"
              type="submit"
            >
              Login
            </button>
            <a href="/forgot-password" className="text-center ">Forgot Password ?</a>
          </form>
        </div>
      </div>
    </div>
  );
}
