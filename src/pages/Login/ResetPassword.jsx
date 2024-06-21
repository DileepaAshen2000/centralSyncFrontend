import * as React from "react";
import image from "../../assests/forgotPassword.jpg";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ResetPassword = () => {
    // const [password, setPassword] = useState('');
    // const [message, setMessage] = useState('');
    const query = useQuery();
    const token = query.get('token');
    const navigate = useNavigate(); 
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [matchError, setMatchError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await axios.post('http://localhost:8080/api/auth/reset-password', { token, password });
    //         setMessage(response.data);
    //         navigate('/'); 
    //     } catch (error) {
    //         setMessage('Failed to reset password');
    //     }
    // };
    const passwordCriteria = {
        minLength: {
          description: "8 characters",
          test: (password) => password.length >= 8,
        },
        hasNumber: {
          description: "1 number",
          test: (password) => /\d/.test(password),
        },
        hasUpperCase: {
          description: "1 uppercase letter",
          test: (password) => /[A-Z]/.test(password),
        },
        hasLowerCase: {
          description: "1 lowercase letter",
          test: (password) => /[a-z]/.test(password),
        },
        hasSpecialChar: {
          description: "1 special character",
          test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
      };
    
      const validatePassword = () => {
        const newErrors = {};
        for (const key in passwordCriteria) {
          if (!passwordCriteria[key].test(password)) {
            newErrors[key] = passwordCriteria[key].description;
          }
        }
        setErrors(newErrors);
      };
    
      useEffect(() => {
        validatePassword();
      }, [password]);
    
      const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
      };
    
      const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setMatchError("Passwords do not match");
          return;
        }
        setMatchError("");
        try {
          const response = await axios.post('http://localhost:8080/api/auth/reset-password', { token, password });
          console.log("Password updated", response.data);
          Swal.fire({
            icon: "success",
            title: "Password successfully Changed!",
            text: "You can now log in to CentralSync",
          });
          navigate("/");
        } catch (error) {
          if (error.response && error.response.data) {
            const responseData = error.response.data;
            if (responseData instanceof Object) {
              setErrors(responseData);
              setMatchError("");
            } else {
              setErrors({});
              setMatchError(responseData);
            }
          }
        }
      };

    return (
        // <div>
        //     <h2>Reset Password</h2>
        //     <form onSubmit={handleSubmit}>
        //         <input
        //             type="password"
        //             value={password}
        //             onChange={(e) => setPassword(e.target.value)}
        //             placeholder="Enter new password"
        //             required
        //         />
        //         <button type="submit">Submit</button>
        //     </form>
        //     {message && <p>{message}</p>}
        // </div>
        <>
            <div className="flex w-full h-screen">
                <div className="grid grid-cols-1 m-auto md:grid-cols-2 h-[630px] shadow-lg shadow-gray-600 sm:max-w-[1000px]">
                <div className="hidden mt-[100px] md:block bg-blue-300">
                    <img src={image} className="w-full h-[530px]" />
                </div>
                <div className="flex flex-col justify-around p-16 bg-blue-300">
                    <form onSubmit={handleSubmit}>
                    <h1 className="mb-6 text-2xl font-bold text-center">
                        Change Password
                    </h1>
                    <h4 className="mb-4 text-sm font-bold">
                        Your email has been successfully verified! Please Enter your new
                        password. Ensure it meets the security criteria listed below.
                    </h4>
                    <div className="flex flex-col gap-3">
                        <TextField
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            ),
                            className: "p-2 border bg-white h-[50px]",
                        }}
                        />
                        {Object.keys(passwordCriteria).map((key, index) => (
                        <div
                            key={index}
                            className={`flex items-center text-xs font-bold ${
                            password
                                ? passwordCriteria[key].test(password)
                                ? "text-green-500"
                                : "text-red-500"
                                : "text-black"
                            }`}
                        >
                            {password ? (
                            passwordCriteria[key].test(password) ? (
                                <CheckIcon fontSize="small" />
                            ) : (
                                <CloseIcon fontSize="small" />
                            )
                            ) : (
                            <span>&#8226;</span>
                            )}
                            <span className="ml-1">
                            {passwordCriteria[key].description}
                            </span>
                        </div>
                        ))}
                        <TextField
                        className="p-2 border"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        InputProps={{
                            endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                >
                                {showConfirmPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                                </IconButton>
                            </InputAdornment>
                            ),
                            className: "p-2 border bg-white h-[50px]",
                        }}
                        />
                        {matchError && (
                        <div className="flex items-center text-xs font-bold text-red-500">
                            <CloseIcon fontSize="small" /> <span>{matchError}</span>
                        </div>
                        )}
                    </div>
                    <button
                        className="w-full py-2 my-4 font-bold text-white bg-blue-600 hover:bg-blue-500"
                        type="submit"
                    >
                        Change Password
                    </button>
                    </form>
                </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
