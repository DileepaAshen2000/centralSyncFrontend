import React from 'react'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import StockOutTable from '../../components/StockOutTable'

const StockOutList = () => {
  const navigate = useNavigate();
  return (
    <Box>
        <Box className="flex pb-4 gap-96">
            <Box>
              <h1 className="pt-2 pb-3 text-3xl font-bold ">Stock Out</h1>
              <p>Here are all stock out items. !!</p>
            </Box>
            <Box className="flex items-center ml-[28%]">
              <Button className="px-6 py-2 text-white bg-blue-600 rounded"
               variant='contained'
               onClick={() => navigate("/newstockin")}
                >Stock Out</Button>
            </Box>
        </Box>
        <StockOutTable/>
        <Box className='mt-10'>
          <Box className="flex pb-4 gap-96">
              <Box>
                <h1 className="pt-2 pb-3 text-3xl font-bold ">Stock Out For Work From Home Employee</h1>
                <p>Here are all stock out items. !!</p>
              </Box>
          </Box>
          <StockOutTable/>
        </Box>
    </Box>
  )
}

export default StockOutList
