import React from 'react'
import RequestsTable from '../../components/InventoryRequest/InventoryRequestsTable'
import Box from '@mui/material/Box';


 
const RequestList = () => {
  return (
  

<Box>
<Box className="flex pb-4">
    <Box>
      <h1 className="pt-2 pb-3 text-3xl font-bold ">Request List</h1>
      <p>Here is a list of all request</p>
    </Box>
   
</Box>
<RequestsTable/>
</Box>
)
}

export default RequestList
