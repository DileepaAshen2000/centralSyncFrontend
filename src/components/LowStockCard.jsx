import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';
import lowStorage from "../assests/low-battery.png"

const LowStockCard = () => {
  
  const [lowStockCount, setLowStockCount] = useState(0);
  useEffect(() => {
    const fetchLowStockCount = async() =>{
      try{
        const response = await axios.get('http://localhost:8080/inventory-item/low-count');
        setLowStockCount(response.data);
      }catch(error){
        console.log("Error fetching low stock count")
      }
    }
    fetchLowStockCount();
  }, []);
  return (
    <div>
      <div className='flex flex-row justify-center items-center h-[100%] gap-2 bg-pink-200 w-[200px] p-4 rounded-lg shadow-xl'>
        <img src={lowStorage} alt="employee" className='object-cover w-12 h-12' />
        <div className='flex flex-col gap-2'>
          <span className='text-sm text-gray-800'>Low Stock</span>
          <span className='text-2xl text-pink-600'>{lowStockCount}</span>
        </div>
      </div>
    </div>
  )
}

export default LowStockCard
