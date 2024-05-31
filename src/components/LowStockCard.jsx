import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios';

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
      <div className='flex flex-col h-[100%] gap-2 bg-pink-200 w-auto p-4 rounded-lg shadow-xl'>
        <span>image</span>
        <span className='text-2xl text-pink-600'>{lowStockCount}</span>
        <span className='text-sm text-gray-800'>Low Stock</span>
      </div>
    </div>
  )
}

export default LowStockCard
