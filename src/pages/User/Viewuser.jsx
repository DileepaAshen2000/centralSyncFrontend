import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Select,Box } from "@mui/material";
// import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate, useParams } from "react-router-dom";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";

const ViewUser = () => {
  // State for user details
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
  });
  const { ID } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details by ID on component mount
    axios
      .get(`http://localhost:8080/user/users/${ID}`)
      .then((response) => {
        // Update user state with fetched data
        setUser(response.data);
      })
      .catch((error) => {
        console.log("Error fetching user:", error);
      });
  }, [ID]);

  // Function to handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Function to save updated user data
  const handleSave = () => {
    // Make PUT request to update the user data
    axios
      .put(`http://localhost:8080/user/update/${ID}`, user)
      .then(() => {
        console.log("User updated successfully");
        // Redirect to user list page after successful update
        navigate("/user");
      })
      .catch((error) => {
        console.log("Error updating user:", error);
      });
  };

  return (

    <>
     <Box className='p-5 bg-white rounded-2xl w-[1122.7px]'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">Edit User</h1>
      </Box>
      <form noValidate>
        <div className="grid grid-cols-6 grid-rows-7  gap-x-[0.25rem] gap-y-7 ">
          <div className="col-span-1 row-span-1">
            <label htmlFor="5">Employee Id</label>
          </div>
          <div className="col-span-2">
            <TextField
              name="id"
              placeholder=""
              InputProps={{
                className:
                  "w-[300px] ",
                readOnly: true,
              }}
              value={ID}
              size="small"
            />
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-2">
            <label htmlFor="name">Name</label>
          </div>
          <div className="col-span-2">
            <TextField
              id="firstName"
              variant="outlined"
              placeholder="First Name"
              InputProps={{
                className:
                  "w-[300px] ",
              }}
              value={user.firstName}
              onChange={handleInputChange}
              name="firstName"
              size="small"
            />
          </div>
          <div className="col-span-3"> </div>
          <div className="col-span-2">
            <TextField
              variant="outlined"
              placeholder="Last Name"
              id="lastName"
              value={user.lastName}
              onChange={handleInputChange}
              name="firstName"
              InputProps={{
                className:
                  "w-[300px] ",
              }}
              size="small"
              
            
            />
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="2">Department</label>
          </div>
          <div className="col-span-2">
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
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="3">Role</label>
          </div>
          <div className="col-span-2">
            <Select
              value={user.role}
              onChange={handleInputChange}
              name="role"
              className="w-[300px]"
              size="small"
            >
              <MenuItem disabled value={user.role}></MenuItem>
              <MenuItem value="Web Developer">Web Developer</MenuItem>
              <MenuItem value="Software Architect">Software Architect</MenuItem>
            </Select>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="4">Date Of Birth</label>
          </div>
          <div className="col-span-2">
            <TextField
              id="date"
              placeholder="dd/mm/yy"
              name="dateOfBirth"
              InputProps={{
                className:
                  "w-[300px] ",
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
            <TextField
              type="text"
              id="adress"
              name="address"
              placeholder=""
              InputProps={{
                className:
                  "w-[300px]",
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
                className:
                  "w-[300px] ",
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
                className:
                  "w-[300px] ",
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
                className:
                  "w-[300px]",
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

        <div className="flex items-center">
          <h3 className="pt-10 pb-10 text-[#796F6F]"> User Credentials</h3>
          <hr className="border-[#796F6F] ml-4 flex-grow" />
        </div>

        <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] ">
          <div className="col-span-1">
            <label htmlFor="name">Password</label>
          </div>
          <div className="col-span-2">
            <TextField
              type="password"
              id="password"
              placeholder=""
              InputProps={{
                className:
                  "w-[300px] ",
              }}
              size="small"
            />{" "}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1">
            <label htmlFor="name">Confirm Password</label>
          </div>
          <div className="col-span-2">
            <TextField
              type="password"
              id="cpassword"
              placeholder=""
              InputProps={{
                className:
                  "w-[300px]",
              }}
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
              onClick={()=>navigate("/user")}
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
export default Userupdate;
