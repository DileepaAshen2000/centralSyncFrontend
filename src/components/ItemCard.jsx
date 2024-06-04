import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Inventory2SharpIcon from '@mui/icons-material/Inventory2Sharp';

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
      <div className='flex flex-col h-[100%] gap-2 bg-orange-200 w-auto p-4 rounded-lg shadow-xl'>
        <Inventory2SharpIcon/>
        <span className='text-2xl text-orange-800'>{itemCount}</span>
        <span className='text-sm text-gray-800'>All Items</span>
      </div>
    </div>
  )
}

export default ItemCard
