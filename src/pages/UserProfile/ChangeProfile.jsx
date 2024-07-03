import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Select, Box,Typography} from "@mui/material";
import LoginService from "../Login/LoginService";
// import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate, useParams } from "react-router-dom";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Swal from "sweetalert2";
//import SmallAvatar from "@mui/material/SmallAvatar";
import DeleteIcon from "@mui/icons-material/Delete";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";

const EditProfile= () => {
  const navigate = useNavigate();
  const { ID } = useParams();
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});

  const [user, setUser] = useState({
     
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    mobileNo: "",
    telNo: "",
    address: "",
    email: "",
    department: "",
    role: "",
    workSite: "",
  });
 
  
  useEffect(() => {
    console.log("Component mounted, fetching profile info");
    fetchProfileInfo();
  }, []);

  useEffect(() => {
    console.log("Profile info updated:", profileInfo);
    if (profileInfo.userId) {
      fetchUserDetails(profileInfo.userId);
    }
  }, [profileInfo]);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await LoginService.getYourProfile(token);
      setProfileInfo(response.users);
    } catch (error) {
      console.error("Error fetching profile information:", error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/user/users/${userId}`);
      setUser(response.data);
      setImageUrl(response.data.imagePath ? `http://localhost:8080/user/display/${userId}` : null);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };


 

  
  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
    setImageUrl(null);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('user', new Blob([JSON.stringify(user)], { type: 'application/json' }));
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await axios.put(`http://localhost:8080/user/update/${profileInfo.userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User profile successfully updated!",
        });
        navigate(-1); 
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update user profile. Please check your inputs.",
      });
      if (error.response) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <>
      <Box className="p-5 bg-white rounded-2xl w-[1122.7px]">
        <Box className="pb-4">
          <h1 className="pt-2 pb-3 text-3xl font-bold ">Edit Profile</h1>
        </Box>
        <form noValidate>
          <div className="grid grid-cols-6 grid-rows-7  gap-x-[0.25rem] gap-y-7 ">
            <div className="col-span-1 row-span-1">
              <label htmlFor="5">Id</label>
            </div>
            <div className="col-span-2">
              <TextField
                name="id"
                placeholder=""
                InputProps={{
                  className: "w-[300px] ",
                  readOnly: true,
                }}
                value={profileInfo.userId}
                size="small"
              />
            </div>
            <div></div>
            <div className="row-span-4 col-span-2">
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
                    className="text-red-600 cursor-pointer mt-[150px]"
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
            <div className="col-span-1">
              <label htmlFor="name">Name</label>
            </div>
            <div className="col-span-2">
              {errors.firstName && (
                <div className="text-[#FC0000] text-sm">{errors.firstName}</div>
              )}
              <TextField
                id="firstName"
                variant="outlined"
                placeholder="First Name"
                InputProps={{
                  className: "w-[300px] ",
                }}
                value={user.firstName}
                onChange={handleInputChange}
                name="firstName"
                size="small"
              />
            </div>
            <div></div>
            <div className="col-span-1"> </div>
            <div className="col-span-2">
              {errors.lastName && (
                <div className="text-[#FC0000] text-sm">{errors.lastName}</div>
              )}
              <TextField
                variant="outlined"
                placeholder="Last Name"
                id="lastName"
                value={user.lastName}
                onChange={handleInputChange}
                name="lastName"
                InputProps={{
                  className: "w-[300px] ",
                }}
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
                value={user.department}
                onChange={handleInputChange}
                name="department"
                id="department"
                className="w-[300px]"
                size="small"
              >
                <MenuItem disabled value={user.department}></MenuItem>
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
              )}
              <Select
                value={user.role}
                onChange={handleInputChange}
                name="role"
                id="role"
                className="w-[300px]"
                size="small"
              >
                <MenuItem disabled value={user.role}></MenuItem>

                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="REQUEST_HANDLER">Request Handler</MenuItem>
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
              </Select>
            </div>
            <div></div>
            <div></div>
            <div></div>
            <div className="col-span-1 row-span-1">
              <label htmlFor="3">Work Site</label>
            </div>
            <div className="col-span-2">
              {errors.workSite && (
                <div className="text-[#FC0000] text-sm">{errors.workSite}</div>
              )}{" "}
              <Select
                value={user.workSite}
                onChange={handleInputChange}
                name="workSite"
                id="workSite"
                className="w-[300px]"
                size="small"
              >
                <MenuItem disabled value={user.workSite}></MenuItem>
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
                placeholder="dd/mm/yy"
                name="dateOfBirth"
                InputProps={{
                  className: "w-[300px] ",
                }}
                InputLabelProps={{ shrink: true }}
                value={user.dateOfBirth}
                onChange={handleInputChange}
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
                name="address"
                placeholder=""
                InputProps={{
                  className: "w-[300px]",
                }}
                value={user.address}
                onChange={handleInputChange}
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
              <TextField
                type="text"
                id="mno"
                placeholder=""
                InputProps={{
                  className: "w-[300px] ",
                }}
                value={user.mobileNo}
                onChange={handleInputChange}
                name="mobileNo"
                size="small"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="name" className="pl-20">
                Tel No
              </label>
            </div>
            <div className="col-span-2">
              <TextField
                type="text"
                id="Tno"
                placeholder=""
                InputProps={{
                  className: "w-[300px] ",
                }}
                name="telNo"
                value={user.telNo}
                onChange={handleInputChange}
                size="small"
              />
            </div>
            <div className="col-span-1">
              <label htmlFor="name">Email Adress</label>
            </div>
            <div className="col-span-2">
              <TextField
                type="text"
                id="email"
                placeholder=""
                InputProps={{
                  className: "w-[300px]",
                }}
                name="email"
                value={user.email}
                onChange={handleInputChange}
                size="small"
              />
            </div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] mt-12 ">
            <div className="col-start-5">
              <Button
                variant="contained"
                className="bg-blue-600 w-[150px] rounded text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
                onClick={handleSave}
              >
                Edit & Save
              </Button>
            </div>
            <div className="col-start-6">
              <Button
                variant="outlined"
                className="bg-white w-[150px] rounded text-[#007EF2] border-blue-[#007EF2] hover:text-white hover:bg-blue-600"
                onClick={() => navigate(-1)}
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
export default EditProfile;

