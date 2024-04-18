import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Select,MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
//import image from "../assests/flyer-Photo.jpg";
import SelectR from "./Select_R";
import SelectD from "./Select_D";
//import DragDrop from "./Drag&Drop";
//import { DropzoneArea } from 'material-ui-dropzone';
//import Dropzone from "./Dropzone";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Description } from "@mui/icons-material";

const TicketForm= () => {
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
      <form>
        <div className="grid grid-cols-6 grid-rows-6  gap-x-5 gap-y-5">
          <div className="col-span-1">
            <label htmlFor="name">Item id</label>
            
           
          </div>
          <div className="col-span-2">
          {errors.firstName && <div className="text-[#FC0000] text-sm">{errors.firstName}</div>}
            <TextField
              id="name"
              variant="outlined"
              placeholder="First Name"
              InputProps={{
                className:
                  "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
              }}
              value={firstName}
              onChange={(e) => setfName(e.target.value)}
            />
           
          </div>{" "}
          <div className="col-span-3">
          

          </div>
          <div className="col-span-1">
            <label htmlFor="name">Item Name</label>
            
           
          </div>
          <div className="col-span-3">
          {errors.lastName && <div className="text-[#FC0000] text-sm">{errors.lastName}</div>}
            
            <TextField
              variant="outlined"
             // placeholder="Item Name"
              InputProps={{
                className:
                  "w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2 ",
              }}
              value={lastName}
              onChange={(e) => setlName(e.target.value)}
            />
          </div>
          <div></div>
          <div></div>
           
          <div className="col-span-1 row-span-1">
            <label htmlFor="2">Topic for ticket</label>
          </div>
          <div className="col-span-2">
          {errors.department && <div className="text-[#FC0000] text-sm">{errors.department}</div>}
          <Select
              
              id="topic"
              className="w-[375px] cursor-auto h-9 border border-[#857A7A] rounded-xl px-2"
            >
              <MenuItem disabled value={department}></MenuItem>
              <MenuItem value="Network Issues">Network Issues</MenuItem>
              <MenuItem value="Hardware Problems">Hardware Problems</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="col-span-1 row-span-1">
            <label htmlFor="3">Description</label>
          </div>
          <div className="col-span-2 row-span-3 ">
          {errors.role && <div className="text-[#FC0000] text-sm">{errors.role}</div>}
          <TextField
              variant="outlined"
              InputProps={{
                className:
                  "w-[450px] cursor-auto h-[100px] border border-[#857A7A] rounded-xl px-2 ",
              }}
              //value={}
              //onChange={(e) => setlName(e.target.value)}
            />
          </div>
          <div></div>
          <div></div>
          <div></div>
            
          
          </div>
          <div></div>
          <div></div>
          <div></div>
       

       
              
             

        <div className="grid grid-cols-6 grid-rows-2 gap-y-7 gap-x-[0.25rem] mt-12 ">
          <div className="col-start-5">
            <Button
              variant="outlined"
              className="bg-[#007EF2] w-[150px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
              onClick={handleClick}
            >
              Save
            </Button>
          </div>
          <div className="col-start-6">
            <Button
              variant="outlined"
              className="bg-white w-[150px] rounded-md text-[#007EF2] border-blue-[#007EF2] hover:text-white hover:bg-[#007EF2]"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
      
       
    </>
  );
};
export default TicketForm;
