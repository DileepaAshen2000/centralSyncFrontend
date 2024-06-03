import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp';

const TotalEmpCard = () => {

  const [empCount, setEmpCount] = useState(0);
  useEffect(() => {
    const fetchEmpCount = async() =>{
      try{
        const response = await axios.get('http://localhost:8080/user/count');
        setEmpCount(response.data);
      }catch(error){
        console.log('Error fetching employee count');
      }
    }
    fetchEmpCount();
  }, []);
  return (
    <div>
      <div className='flex flex-col h-[100%] gap-2 bg-green-300 w-auto p-4 rounded-lg shadow-xl'>
        <PeopleAltSharpIcon/>
        <span className='text-2xl text-green-800'>{empCount}</span>
        <span className='text-sm text-gray-800'>Total Employees</span>
      </div>
    </div>
  )
}

export default TotalEmpCard
