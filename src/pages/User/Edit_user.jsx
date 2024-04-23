import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Select } from "@mui/material";
// import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate, useParams } from "react-router-dom";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";

const Userupdate = () => {
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
      <form noValidate>
        <div className="grid grid-cols-6 grid-rows-7  gap-x-[0.25rem] ">
          <div className="col-span-1 row-span-1">
            <label htmlFor="5">Employee Id</label>
          </div>
          <div className="col-span-2">
            <TextField
              name="id"
              placeholder=""
              InputProps={{
                className:
                  "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
                readOnly: true,
              }}
              value={ID}
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
                  "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
              }}
              value={user.firstName}
              onChange={handleInputChange}
              name="firstName"
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
                  "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
              }}
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
              className="w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2"
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
              className="w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2"
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
                  "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
              }}
              InputLabelProps={{ shrink: true }}
              value={user.dateOfBirth}
              onChange={handleInputChange}
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
                  "w-[375px] cursor-auto h-[65px] border border-[#857A7A] rounded-xl px-2",
              }}
              value={user.address}
              onChange={handleInputChange}
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
                  "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2 ",
              }}
              value={user.mobileNo}
              onChange={handleInputChange}
              name="mobileNo"
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
                  "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2 ",
              }}
              name="telNo"
              value={user.telNo}
              onChange={handleInputChange}
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
                  "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2",
              }}
              name="email"
              value={user.email}
              onChange={handleInputChange}
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
                  "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2 ",
              }}
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
                  "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2 ",
              }}
            />
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] mt-12 ">
          <div className="col-start-5">
            <Button
              variant="outlined"
              className="bg-[#007EF2] w-[150px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
              onClick={handleSave}
            >
              Edit & Save
            </Button>
          </div>
          <div className="col-start-6">
            <Button
              variant="outlined"
              className="bg-white w-[150px] rounded-md text-[#007EF2] border-blue-[#007EF2] hover:text-white hover:bg-[#007EF2]"
              onClick={()=>navigate("/user")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};
export default Userupdate;
