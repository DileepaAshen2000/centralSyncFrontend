import React from 'react'
import Table from '../../components/Table'
import { Box } from '@mui/material'
// import Button from '../../components/InventoryRequest/Button' 
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const Adjustment = () => {
  const navigate = useNavigate();
  return (
    <Box>
        <Box className="flex pb-4 gap-96">
            <Box>
              <h1 className="pt-2 pb-3 text-3xl font-bold ">Adjustment</h1>
              <p>Here are all adjustments. !!</p>
            </Box>
            <Box className="flex items-center">
              <Button className="px-6 py-2 text-white bg-blue-600 rounded"
               variant='contained'
               onClick={() => navigate("/newadjustment")}
                >New Adjustment</Button>
            </Box>
        </Box>
        <Table/>
    </Box>
  )
}

export default Adjustment
