import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Select,Box,MenuItem} from "@mui/material";
import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";

const CreateUser= () => {
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
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleClick = (e) => {
    e.preventDefault();
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
      
    };
    console.log(user);
    fetch("http://localhost:8080/user/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    .then(response => {
      if(response.ok){
        console.log("New User added");

      }
      else{
        response.json().then(errors =>{
          setErrors(errors);
        });
      }
    });
  };
    

  return (
    <>
    <Box className='p-5 bg-white rounded-2xl w-[1122.7px]'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">New User</h1>
      </Box>

    
      <form>
        <div className="grid grid-cols-6 grid-rows-6 gap-y-7 gap-x-[0.25rem] ">
          <div className="col-span-1 row-span-2">
            <label htmlFor="name">Name</label>
            
           
          </div>
          <div className="col-span-2">
          {errors.firstName && <div className="text-[#FC0000] text-sm">{errors.firstName}</div>}
            <TextField
              id="name"
              label="Firstname"
              variant="outlined"
              //placeholder="First Name"
              InputProps={{
                className:
                  "w-[300px]",
              }}
              value={firstName}
              onChange={(e) => setfName(e.target.value)}
              size="small"
            />
           
          </div>{" "}
          <div className="col-span-3">
          

          </div>
          <div className="col-span-2">
          {errors.lastName && <div className="text-[#FC0000] text-sm">{errors.lastName}</div>}
            
            <TextField
              variant="outlined"
              label="Last Name"
              InputProps={{
                className:
                  " w-[300px]",
              }}
              value={lastName}
              onChange={(e) => setlName(e.target.value)}
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
          {errors.department && <div className="text-[#FC0000] text-sm">{errors.department}</div>}
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
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="3">Role</label>
          </div>
          <div className="col-span-2">
          {errors.role && <div className="text-[#FC0000] text-sm">{errors.role}</div>}
            {" "}
            <Select
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              name="role"
              className="w-[300px]"
              size="small"
              label="Role"
            >
              <MenuItem disabled value={role}></MenuItem>
              <MenuItem value="Web Developer">Web Developer</MenuItem>
              <MenuItem value="Software Architect">Software Architect</MenuItem>
            </Select>{" "}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="4">Date Of Birth</label>
          </div>
          <div className="col-span-2">
          {errors.dateOfBirth && <div className="text-[#FC0000] text-sm">{errors.dateOfBirth}</div>}
            <TextField
              id="date"
              type="date"
              InputProps={{
                className:
                  " w-[300px]",
              }}
              InputLabelProps={{ shrink: true }}
              value={dateOfBirth}
              onChange={(e) => setDOb(e.target.value)}
              size="small"
              label="Date Of Birth"
            />
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="5">Adress</label>
          </div>
          <div className="col-span-2">
          {errors.address && <div className="text-[#FC0000] text-sm">{errors.address}</div>}
            <TextField
              type="text"
              id="adress"
              placeholder=""
              InputProps={{
                className:
                  " w-[300px]",
              }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              size="small"
              label="Address"
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
          {errors.mobileNo && <div className="text-[#FC0000] text-sm">{errors.mobileNo}</div>}
            <TextField
              type="text"
              id="mno"
              placeholder=""
              InputProps={{
                className:
                  " w-[300px] ",
              }}
              value={mobileNo}
              onChange={(e) => setMNumber(e.target.value)}
              size="small"
              label="Mobile No"
            />{" "}
          </div>
          <div className="col-span-1">
            <label htmlFor="name" className="pl-20">
              Tel No
            </label>
          </div>
          <div className="col-span-2">
          {errors.telNo&& <div className="text-[#FC0000] text-sm">{errors.telNo}</div>}
            <TextField
              type="text"
              id="Tno"
              placeholder=""
              InputProps={{
                className:
                  " w-[300px] ",
              }}
              value={telNo}
              onChange={(e) => setTelNUmber(e.target.value)}
              size="small"
              label="Tel No"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="name">Email Adress</label>
          </div>
          <div className="col-span-2">
          {errors.email && <div className="text-[#FC0000] text-sm">{errors.email}</div>}
            <TextField
              type="text"
              id="email"
              placeholder=""
              InputProps={{
                className:
                  " w-[300px]",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              label="Email"
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
          {errors.password && <div className="text-[#FC0000] text-sm">{errors.password}</div>}
            <TextField
              type="password"
              id="password"
              placeholder=""
              InputProps={{
                className:
                  " w-[300px] ",
              }}
              size="small"
              label="Password"
            />{" "}
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1">
            <label htmlFor="name">Confirm Password</label>
          </div>
          <div className="col-span-2">
          {errors.cpassword && <div className="text-[#FC0000] text-sm">{errors.cpassword}</div>}
            <TextField
              type="password"
              id="cpassword"
              placeholder=""
              InputProps={{
                className:
                  " w-[300px] ",
              }}
              size="small"
              label="Password"
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
