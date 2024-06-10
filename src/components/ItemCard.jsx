import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import itemImage from "../assests/inventory.png"

const ItemCard = () => {

  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const fetchItemCount = async () => {
      try {
        const response = await axios.get('http://localhost:8080/inventory-item/count');
        setItemCount(response.data);
      } catch (error) {
        console.log('Error fetching item count');
      }
    };

    fetchItemCount();
  }, []);
  return (
    <div>
      <div className='flex flex-row justify-center items-center h-[100%] gap-2 bg-orange-200 w-[200px] p-4 rounded-lg shadow-xl'>
        <img src={itemImage} alt="employee" className='object-cover w-12 h-12' />
        <div className='flex flex-col gap-2'>
          <span className='text-sm text-gray-800'>All Items</span>
          <span className='text-2xl text-orange-800'>{itemCount}</span>
        </div>
        
      </div>
    </div>
  )
}

export default ItemCard
