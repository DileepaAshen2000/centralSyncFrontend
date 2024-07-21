import * as React from "react";
import { useParams } from "react-router-dom";
import image from "../../assests/changepassword.jpg"
import { useEffect, useState } from "react";
import axios from "axios";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IconButton, InputAdornment, TextField,CircularProgress,Backdrop } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginService from "../Login/LoginService";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [profileInfo, setProfileInfo] = useState({});
  const [matchError, setMatchError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");  
      const response = await LoginService.getYourProfile(token);
      setProfileInfo(response.users);
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMatchError("Passwords do not match");
      return;
    }
    setMatchError("");
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:8080/user/${profileInfo.userId}/password`,
        { password, confirmPassword }
      );
      console.log("Password updated", response.data);
      Swal.fire({
        icon: "success",
        title: "Password successfully created!",
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
    finally {
      setLoading(false);
    }
  };

  

  return (
    <>
      <div className=" bg-white">
      <h1 className="text-4xl font-bold mb-3 ml-5 pt-6 text-blue-600">
                Change Password
              </h1>
              <h4 className="font-bold text-md ml-5 mt-6" >
              You can change your password here, ensuring it meets the security criteria listed below.
              </h4>
        <div className="grid grid-cols-1 m-auto md:grid-cols-2 h-[630px] sm:max-w-[1000px]">
        
          <div className="hidden mt-[50px] md:block">
          
            <img src={image} className="w-full h-[530px]" />
          </div>
          <div className="flex flex-col justify-around p-16">
            <form onSubmit={handleSubmit}>
            
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
                  <div className="flex items-center text-red-500 text-xs font-bold">
                    <CloseIcon fontSize="small" /> <span>{matchError}</span>
                  </div>
                )}
              </div>
              <button
                className="w-full py-2 my-4 text-white font-bold bg-blue-600 hover:bg-blue-500"
                type="submit"
              >
                Change Password
              </button>
              <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
