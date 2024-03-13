import React, { useEffect, useState } from "react";
import { TextField, Button, Stack, Select } from "@mui/material";
import { useForm } from "react-hook-form";
import Typography from "@mui/material/Typography";


const Changepassword = () =>{
    return(
        <div>
 <h1 className="pt-6 pb-10 text-3xl font-bold ">Change Password</h1>

<form noValidate>

<div className="grid grid-cols-5 grid-rows-3 gap-y-7 gap-x-[0.02rem] ">
          <div className="col-span-1">
            <label htmlFor="name">Current Password</label>
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
           
          <div className="col-span-1">
            <label htmlFor="name">New Password</label>
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
         

          <div className="col-span-1">
            <label htmlFor="name">Confirm New Password</label>
          </div>
          <div className="col-span-2">
            <TextField
              type="password"
              id="cpassword"
              placeholder=""
              InputProps={{
                className:
                  "w-[375px] cursor-auto h-[35px] border border-[#857A7A] rounded-xl px-2  ",
              }}
            />
          </div>
          <div></div>
          <div></div>
          
           
          
        </div>
        <div className="grid grid-cols-7 grid-rows-2 gap-y-7 gap-x-[0.25rem] mt-12 ">
          <div className="col-start-4">
            <Button
              variant="outlined"
              className="bg-[#007EF2] w-[150px] rounded-md text-white border-blue-[#007EF2] hover:text-[#007EF2] hover:bg-white"
              
            >
              
              Save 
            </Button>
          </div>
          <div className="col-start-5">
            <Button
              variant="outlined"
              className="bg-white w-[150px] rounded-md text-[#007EF2] border-blue-[#007EF2] hover:text-white hover:bg-[#007EF2]"
            >
              
              Cancel 
            </Button>
          </div>
        </div>
</form>
</div>
    )
}
export default Changepassword