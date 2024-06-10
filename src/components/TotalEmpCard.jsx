import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import userImage from "../assests/team.png"

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
      <div className='flex flex-row justify-center items-center h-[100%] gap-2 bg-green-300 w-[200px] p-4 rounded-lg shadow-xl'>
        <img src={userImage} alt="employee" className='object-cover w-12 h-12' />
        <div className='flex flex-col gap-2'>
          <span className='text-sm text-gray-800'>Total Employees</span>
          <span className='text-2xl text-green-800'>{empCount}</span>
        </div>
      </div>
    </div>
  )
}

export default TotalEmpCard
