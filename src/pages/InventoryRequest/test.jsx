import React from 'react'
import NavBar from '../../components/NavBar'
import SideBar from '../../components/SideBar'
import Button from '../../components/InventoryRequest/Button'
import {
    Stack,
    Box,
} from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios';





const SelectedInventoryRequest = () => {
    const [rows, setData] = useState([])
    useEffect(() => {
        axios.get('http://localhost:8080/request/getAll')
            .then((response) => {

                const data = response.data.map((user, index) => ({

                    id: index + 1,
                    refNo: user.refNo, // Assuming a "refNo" property in the response data
                    date: user.date, // Assuming a "date" property in the response data
                    reason: user.reason,
                    department: user.depName,
                    createdBy: user.createdBy, // Assuming a "createdBy" property in the response data
                    status: user.reqStatus,
                    createdBy: user.createdBy, // Assuming a "createdBy" property in the response data
                    empID: user.empID,
                }));
                setData(data);
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])


    return (
        <div>
            <div >
                <NavBar />
            </div>
            <div className='flex h-screen'>
                <div className='box-border hidden border-2 md:block w-96'>
                    <SideBar />
                </div>
                <div className='w-screen p-10 ' >

                    <Box sx={{
                        backgroundColor: '#d9d9d9',
                        padding: '10px',

                    }}>
                        <Stack
                            direction="row-reverse" spacing={2}>
                            <Button>Print</Button>
                            <Button>Reject</Button>
                            <Button>Accept</Button>
                        </Stack>
                    </Box>
                   
                    <div>
                    <section className="flex flex-row items-end justify-end mb-6">
              <header className="text-3xl">INVENTORY ADJUSTMENT</header>
              </section>
              <section className="flex flex-row items justify-end gap-10">
              <ul className='flex flex-col gap-2'>
                <li className="font-bold">Ref. No</li>
                <li className="font-bold">Date</li>
                <li className="font-bold">Reason</li>
                <li className="font-bold">Department</li>
                <li className="font-bold">Created By</li>
                <li className="font-bold">Emp.ID</li>
              </ul>
              {rows.map((row) => (
              <ul className='flex flex-col gap-2'>
             
              
                <li>{row.department}</li>
             
               
              </ul>
               ))}
              </section>
              </div>

                   
 
                    



                    {/* Enter components here, that you want to insert. */}
                </div>
            </div>
        </div>
    )
}
export default SelectedInventoryRequest