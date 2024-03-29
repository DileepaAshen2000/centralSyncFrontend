import React from 'react'
import { useNavigate } from "react-router-dom";
import NavBar from '../../components/NavBar'
import SideBar from '../../components/SideBar'
import {Button} from "@mui/material";
import UserTable from '../../components/User_Components/UserTable';
import { Box } from '@mui/material'


const User = () => {
  const navigate=useNavigate();
     
  return (
    <Box>
        <Box className="pb-4">
            <h1 className="pt-6 pb-3 text-3xl font-bold ">Employees</h1>
             
            <p>Here are all employees!!</p>
        </Box>
        <UserTable/>
    </Box>
  )
}

export default User
 
           
         