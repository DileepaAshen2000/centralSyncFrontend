import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Select,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Avatar from "react-avatar-edit";
import DeleteIcon from "@mui/icons-material/Delete";
import camera from "../../assests/camera.png";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const CreateUser = () => {
  const form = useForm();
  const [firstName, setfName] = useState("");
  const [lastName, setlName] = useState("");
  const [dateOfBirth, setDOb] = useState("");
  const [mobileNo, setMNumber] = useState("");
  const [telNo, setTelNUmber] = useState("");
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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Handle file change
    const file = e.target.files[0];
    if (file) {
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

    const formData = new FormData();

    // Append form fields as a JSON object
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

    // Append file if it exists
    if (image) {
      formData.append("image", image);
    }

    try {
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
      if (error.response) {
        setErrors(error.response.data);
      }
    }
  };

  const onClose = () => {
    setPreview(null);
  };
  const onCrop = (view) => {
    setPreview(view);
  };
  return (
    <>
      <Box className="p-5 bg-white rounded-2xl w-[1122.7px]">
        <Box className="pb-4">
          <h1 className="pt-2 pb-3 text-3xl font-bold ">New User</h1>
        </Box>

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
                id="name"
                variant="outlined"
                //placeholder="First Name"
                InputProps={{
                  className: "w-[300px]",
                }}
                value={firstName}
                onChange={(e) => setfName(e.target.value)}
                size="small"
              />
            </div>{" "}
            <div></div>
            <div className="row-span-4 col-span-2">
              <div className="w-[200px] h-[200px] border-2 border-gray-300 rounded-full flex items-center justify-center">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Uploaded"
                      className="w-[200px] h-[200px] object-cover rounded-full ml-6"
                    />

                    <DeleteIcon
                      onClick={handleImageDelete}
                      className="mt-[150px] text-red-600"
                    />
                  </>
                ) : (
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <AddAPhotoIcon className="w-[60px] h-[60px] ml-5 text-[#007EF2]" />
                    <Typography className="font-bold">Profile Picture</Typography>
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
                onChange={(e) => setlName(e.target.value)}
                size="small"
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
                onChange={(e) => setDepartment(e.target.value)}
                name="department"
                id="department"
                className="w-[300px]"
                size="small"
                label="Department"
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
                onChange={(e) => setRole(e.target.value)}
                name="role"
                id="role"
                className="w-[300px]"
                size="small"
              >
                <MenuItem disabled value={role}></MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
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
                onChange={(e) => setWorkSite(e.target.value)}
                name="workSite"
                id="workSite"
                className="w-[300px]"
                size="small"
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
                onChange={(e) => setDOb(e.target.value)}
                size="small"
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
                onChange={(e) => setAddress(e.target.value)}
                size="small"
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
                onChange={(e) => setMNumber(e.target.value)}
                size="small"
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
                onChange={(e) => setTelNUmber(e.target.value)}
                size="small"
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
                onChange={(e) => setEmail(e.target.value)}
                size="small"
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
                onClick={() => navigate("/user")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </>
  );
};
export default CreateUser;
