import React from 'react'

const ItemCard = () => {
  return (
    <div>
      <div className='flex flex-col h-[8%] gap-2 bg-orange-200 w-[20%] p-4 rounded-lg shadow-xl'>
        <span>image</span>
        <span className='text-2xl text-orange-800'>123</span>
        <span className='text-sm text-gray-800'>All Items</span>
      </div>
    </div>
  )
}

export default ItemCard
