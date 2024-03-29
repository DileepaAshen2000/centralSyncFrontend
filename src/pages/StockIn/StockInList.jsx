import React from 'react'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import StockInTable from '../../components/StockInTable'

const StockInList = () => {
  const navigate = useNavigate();
  return (
    <Box>
        <Box className="flex pb-4 gap-96">
            <Box>
              <h1 className="pt-2 pb-3 text-3xl font-bold ">Stock In</h1>
              <p>Here are all stock in items. !!</p>
            </Box>
            <Box className="flex items-center ml-[28%]">
              <Button className="px-6 py-2 text-white bg-blue-600 rounded"
               variant='contained'
               onClick={() => navigate("/newstockin")}
                >Stock In</Button>
            </Box>
        </Box>
        <StockInTable/>
    </Box>
  )
}

export default StockInList
