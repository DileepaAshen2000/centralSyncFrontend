import React from 'react'

const TotalEmpCard = () => {
  return (
    <div>
      <div className='flex flex-col h-[8%] gap-2 bg-green-300 w-[20%] p-4 rounded-lg shadow-xl'>
        <span>image</span>
        <span className='text-2xl text-green-800'>1250 +</span>
        <span className='text-sm text-gray-800'>Total Employees</span>
      </div>
    </div>
  )
}

export default TotalEmpCard
