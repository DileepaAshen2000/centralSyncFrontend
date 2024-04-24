import React from 'react'
import R_Table from '../../components/R_Table'
import { Box } from '@mui/material'
// import Button from '../../components/InventoryRequest/Button' 
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import My_Reservation from '../../components/My_Reservation'

const R_admin = () => {
  const navigate = useNavigate();
  return (
    <Box>
        <Box className="flex pb-4 gap-96">
            <Box>
              <h1 className="pt-2 pb-3 text-3xl font-bold ">My Reservation</h1>
              <p>Here is a list of all my reservation</p>
            </Box>
            <Box className="flex items-center">
              <Button className="px-6 py-2 text-white bg-blue-600 rounded"
               variant='contained'
               onClick={() => navigate("/newreservation")}
                >New Reservation</Button>
            </Box>
        </Box>
        <My_Reservation/>
        <h1 className="pt-2 pb-3 text-3xl font-bold ">Reservation</h1>
              <p>Here is a list of all reservation</p>
              <R_Table/>
    </Box>
  )
}

export default R_admin