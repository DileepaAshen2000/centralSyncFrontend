import React from 'react'
import UserTable from '../../components/UserTable';
import { Box } from '@mui/material'


const User = () => {  
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
 
           
         