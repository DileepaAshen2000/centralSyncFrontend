import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'

import Adjustment from './Adjustment/Adjustment'
import NewAdjustment from './Adjustment/NewAdjustment'

const Home = () => {
  return (
    <div>
      <div>
        <NavBar></NavBar>
      </div>
  
      <div className='flex h-screen'>
        <div className='box-border hidden border-2 md:block w-96'>
          <SideBar></SideBar>
        </div>
          
      
        <div className='w-screen p-10'>
          {/* Enter components here, that you want to insert. */}
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Dashboard name="Dashboard"/>}></Route>
              <Route path='/adjustment' element={<Adjustment/>}></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  )
}

export default Home
