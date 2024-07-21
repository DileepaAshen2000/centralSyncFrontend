import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Select,
  Box,
  MenuItem,
  Typography,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import DeleteIcon from "@mui/icons-material/Delete";
import camera from "../../assests/camera.png";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const CreateUser = () => {
  const form = useForm();
  const [firstName, setfName] = useState("");
  const [lastName, setlName] = useState("");
  const [dateOfBirth, setDOb] = useState("");
  const [mobileNo, setMNumber] = useState("");
  const [telNo, setTelNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");
  const [workSite, setWorkSite] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [fetchData, setFetchData] = useState(false);
  const [src, setSrc] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    const validationErrors = {};
    if (name === "firstName") {
      if (!value) {
        validationErrors.firstName = "First name is required";
      } else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) {
        validationErrors.firstName = "First name must contain only letters";
      }
    } else if (name === "lastName") {
      if (!value) {
        validationErrors.lastName = "Last name is required";
      } else if (!/^[a-zA-Z][a-zA-Z\s]*$/.test(value)) {
        validationErrors.lastName = "Last name must contain only letters";
      }
    } else if (name === "role" && !value) {
      validationErrors.role = "Role is required";
    } else if (name === "mobileNo") {
      if (!value) {
        validationErrors.mobileNo = "Mobile number is required";
      } else if (!/^\d{10}$/.test(value)) {
        validationErrors.mobileNo = "Mobile number must be 10 digits";
      }
    } else if (name === "telNo") {
      if (!value) {
        validationErrors.telNo = "Telephone number is required";
      } else if (!/^\d{10}$/.test(value)) {
        validationErrors.telNo = "Telephone number must be 10 digits";
      }
    } else if (name === "email") {
      if (!value) {
        validationErrors.email = "Email address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        validationErrors.email = "Invalid email address";
      }
    } else if (name === "dateOfBirth") {
      if (!value) {
        validationErrors.dateOfBirth = "Date of birth is required";
      } else if (new Date(value) >= new Date()) {
        validationErrors.dateOfBirth = "Date should be past";
      }
    } else if (name === "address" && !value) {
      validationErrors.address = "Address is required";
    } else if (name === "department" && !value) {
      validationErrors.department = "Department is required";
    } else if (name === "workSite" && !value) {
      validationErrors.workSite = "Worksite is required";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validationErrors[name],
    }));

    // Remove the error if there is no validation error for the field
    if (!validationErrors[name]) {
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Handle file change
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          image: "File must be a JPG, JPEG, or PNG image",
        }));
        return;
      }

      setErrors((prevErrors) => {
        const { image, ...rest } = prevErrors;
        return rest;
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setImageUrl(null);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    const user = {
      firstName,
      lastName,
      dateOfBirth,
      mobileNo,
      address,
      email,
      telNo,
      department,
      role,
      workSite,
    };

    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );

    if (image) {
      formData.append("image", image);
    }

    try {
      // Make the POST request
      const response = await axios.post(
        "http://localhost:8080/user/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Handle success case
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User successfully added!",
        });
        setFetchData(!fetchData);
        navigate("/user", { fetchData });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add new user. Please check your inputs.",
      });
      const backendErrors = error.response.data;
      setErrors(backendErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box className="p-5 bg-white rounded-2xl w-[1122.7px]">
        <div className="pb-12">
          <Box className="w-[1100.7px]  bg-blue-900 text-white text-center p-3">
            <header className="text-3xl font-bold">New User</header>
          </Box>
        </div>

        <form>
          <div className="grid grid-cols-6 grid-rows-7 gap-y-7 gap-x-[0.25rem] ">
            <div className="col-span-1 row-span-2">
              <label htmlFor="name">Name</label>
            </div>
            <div className="col-span-2">
              {errors.firstName && (
                <div className="text-[#FC0000] text-sm">{errors.firstName}</div>
              )}
              <TextField
                id="firstame"
                variant="outlined"
                //placeholder="First Name"
                InputProps={{
                  className: "w-[300px]",
                }}
                value={firstName}
                src={imageUrl}
                onChange={(e) => {
                  setfName(e.target.value);
                  validateField("firstName", e.target.value);
                }}
                size="small"
                name="firstName"
                onBlur={handleBlur}
                error={!!errors.firstName}
              />
            </div>{" "}
            <div></div>
            <div className="col-span-2 row-span-4">
              <div className="w-[200px] h-[200px] border-2 border-gray-300 rounded-full flex items-center justify-center">
                {imageUrl ? (
                  <>
                    <Avatar
                      alt="Profile pic"
                      src={imageUrl}
                      sx={{ width: 220, height: 220 }}
                    />

                    <DeleteIcon
                      onClick={handleImageDelete}
                      className="mt-[150px] text-red-600"
                    />
                  </>
                ) : (
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <AddAPhotoIcon className="w-[60px] h-[60px] ml-5 text-[#007EF2]" />
                    <Typography className="font-bold">
                      Profile Picture
                    </Typography>
                  </label>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {errors.image && (
                <div className="text-[#FC0000] text-sm ">{errors.image}</div>
              )}
            </div>
            <div className="col-span-2">
              {errors.lastName && (
                <div className="text-[#FC0000] text-sm">{errors.lastName}</div>
              )}

              <TextField
                variant="outlined"
                InputProps={{
                  className: " w-[300px]",
                }}
                value={lastName}
                onChange={(e) => {
                  setlName(e.target.value);
                  validateField("lastName", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.lastName}
                name="lastName"
              />
            </div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="2">Department</label>
            </div>
            <div className="col-span-2">
              {errors.department && (
                <div className="text-[#FC0000] text-sm">
                  {errors.department}
                </div>
              )}

              <Select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  validateField("department", e.target.value);
                }}
                name="department"
                id="department"
                className="w-[300px]"
                size="small"
                label="Department"
                onBlur={handleBlur}
                error={!!errors.department}
              >
                <MenuItem disabled value={department}></MenuItem>
                <MenuItem value="Programming">Programming</MenuItem>
                <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
              </Select>
            </div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="3">Role</label>
            </div>
            <div className="col-span-2">
              {errors.role && (
                <div className="text-[#FC0000] text-sm">{errors.role}</div>
              )}{" "}
              <Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  validateField("role", e.target.value);
                }}
                name="role"
                id="role"
                className="w-[300px]"
                size="small"
                onBlur={handleBlur}
                error={!!errors.role}
              >
                <MenuItem disabled value={role}></MenuItem>
                {/*<MenuItem value="ADMIN">Admin</MenuItem>*/}
                <MenuItem value="REQUEST_HANDLER">Request Handler</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
              </Select>{" "}
            </div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="3">Work Site</label>
            </div>
            <div className="col-span-2">
              {errors.workSite && (
                <div className="text-[#FC0000] text-sm">{errors.workSite}</div>
              )}{" "}
              <Select
                value={workSite}
                onChange={(e) => {
                  setWorkSite(e.target.value);
                  validateField("workSite", e.target.value);
                }}
                name="workSite"
                id="workSite"
                className="w-[300px]"
                size="small"
                onBlur={handleBlur}
                error={!!errors.workSite}
              >
                <MenuItem disabled value={workSite}></MenuItem>
                <MenuItem value="ONSITE">Onsite</MenuItem>
                <MenuItem value="ONLINE">Online</MenuItem>
                <MenuItem value="NOT_ASSIGNED">Not assigned</MenuItem>
              </Select>{" "}
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="4">Date Of Birth</label>
            </div>
            <div className="col-span-2">
              {errors.dateOfBirth && (
                <div className="text-[#FC0000] text-sm">
                  {errors.dateOfBirth}
                </div>
              )}
              <TextField
                id="date"
                type="date"
                InputProps={{
                  className: " w-[300px]",
                }}
                InputLabelProps={{ shrink: true }}
                value={dateOfBirth}
                onChange={(e) => {
                  setDOb(e.target.value);
                  validateField("dateOfBirth", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.dateOfBirth}
                name="dateOfBirth"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="5">Adress</label>
            </div>
            <div className="col-span-2">
              {errors.address && (
                <div className="text-[#FC0000] text-sm">{errors.address}</div>
              )}
              <TextField
                type="text"
                id="adress"
                placeholder=""
                InputProps={{
                  className: " w-[300px]",
                }}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  validateField("address", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.address}
                name="address"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="flex items-center">
            <h3 className="pt-10 pb-10 text-[#796F6F]"> User Contact Info</h3>
            <hr className="border-[#796F6F] ml-4 flex-grow" />
          </div>

          <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] ">
            <div className="col-span-1">
              <label htmlFor="name">Mobile No </label>
            </div>
            <div className="col-span-2">
              {errors.mobileNo && (
                <div className="text-[#FC0000] text-sm">{errors.mobileNo}</div>
              )}
              <TextField
                type="text"
                id="mno"
                placeholder=""
                InputProps={{
                  className: " w-[300px] ",
                }}
                value={mobileNo}
                onChange={(e) => {
                  setMNumber(e.target.value);
                  validateField("mobileNo", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.mobileNo}
                name="mobileNo"
              />{" "}
            </div>
            <div className="col-span-1">
              <label htmlFor="name" className="pl-20">
                Tel No
              </label>
            </div>
            <div className="col-span-2">
              {errors.telNo && (
                <div className="text-[#FC0000] text-sm">{errors.telNo}</div>
              )}
              <TextField
                type="text"
                id="Tno"
                placeholder=""
                InputProps={{
                  className: " w-[300px] ",
                }}
                value={telNo}
                onChange={(e) => {
                  setTelNumber(e.target.value);
                  validateField("telNo", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.telNo}
                name="telNo"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="name">Email Adress</label>
            </div>
            <div className="col-span-2">
              {errors.email && (
                <div className="text-[#FC0000] text-sm">{errors.email}</div>
              )}
              <TextField
                type="text"
                id="email"
                placeholder=""
                InputProps={{
                  className: " w-[300px]",
                }}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField("email", e.target.value);
                }}
                size="small"
                onBlur={handleBlur}
                error={!!errors.email}
                name="email"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="flex-row col-span-10 col-start-1"></div>

          <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] mt-12 ">
            <div className="col-start-5">
              <Button
                variant="contained"
                className="px-6 py-2 bg-blue-600 rounded w-[150px] text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                onClick={handleClick}
              >
                Save
              </Button>
            </div>
            <div className="col-start-6">
              <Button
                variant="outlined"
                className="px-6 py-2 rounded w-[150px] text-[#007EF2] border-blue-[#007EF2] hover:text-white hover:bg-[#007EF2]"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </div>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </form>
      </Box>
    </>
  );
};
export default CreateUser;
