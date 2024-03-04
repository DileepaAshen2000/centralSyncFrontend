import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard'

import Adjustment from './Adjustment/Adjustment'
import NewAdjustment from './Adjustment/NewAdjustment'
import User from './User/User'
import CreateUser from './User/CreateUser'
import Userupdate from './User/Edit_user'
import EditUser from '../components/UserEditForm'

const Home = () => {
  return (
    <div>
      <div>
        <NavBar/>
      </div>
  
      <div className='flex h-screen'>
        <div className='box-border hidden border-2 md:block w-96'>
          <SideBar/>
        </div>
          
      
        <div className='w-screen p-10'>
          {/* Enter components here, that you want to insert. */}
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Dashboard name="Dashboard"/>}></Route>
              <Route path='/adjustment' element={<Adjustment/>}></Route>
              <Route path='/user' element={<User/>}></Route>
              <Route path="/newUser" element={<CreateUser/>}/>
              <Route path="/user/users/:ID" element={<EditUser/>}/>
        

            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  )
}

export default Home
