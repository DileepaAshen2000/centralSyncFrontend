import React from 'react'
import Table from '../../components/Table'
import { Box, Button } from '@mui/material'

const Adjustment = () => {
  return (
    <Box>
        <Box className="flex pb-4">
            <Box>
              <h1 className="pt-2 pb-3 text-3xl font-bold ">Adjustment</h1>
              <p>Here are all adjustments. !!</p>
            </Box>
            <Box className="flex items-center">
              <Button variant='contained' color='primary' href='/newadjustment'>New Adjustment</Button>
            </Box>
        </Box>
        <Table/>
    </Box>
  )
}

export default Adjustment
