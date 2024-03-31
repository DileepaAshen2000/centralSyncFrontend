import * as React from 'react';

// import { Grid } from '@mui/material';
import TotalEmpCard from '../components/TotalEmpCard';
import ItemCard from '../components/ItemCard';
import LowStockCard from '../components/LowStockCard';

export default function AdminDashboard() {
  return (
    
    <div>
      <div><h1 className='pt-2 pb-3 text-3xl font-bold'>Dashboard</h1></div>
      <div className='flex flex-col gap-4'>
        <div><TotalEmpCard/></div>
        <div><ItemCard/></div>
        <div><LowStockCard/></div>
      </div>
      
    </div>
  );
}


