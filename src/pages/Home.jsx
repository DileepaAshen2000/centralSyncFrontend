import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
//import Dashboard from './Dashboard'
import Adjustment from './Adjustment/Adjustment'
import NewAdjustment from './Adjustment/NewAdjustment'
import User from './User/User'
import CreateUser from './User/CreateUser'
import Userupdate from './User/Edit_user'
import EditUser from '../components/UserEditForm'
import { Grid } from '@mui/material'
import AdjustmentDocument from './Adjustment/AdjustmentDocument'
import RequestList from './InventoryRequest/InventoryRequestList'

const Home = () => {
  return (
    <div>
      <div>
        <NavBar/>
      </div>
      <Grid container className="flex">
        <Grid item sm={2.5} className='box-border hidden h-screen md:block w-96'>
          <SideBar></SideBar>
        </Grid>

        <Grid item sm={9.5} style={{ backgroundColor: '#eeeeee' }} className='w-screen p-10'>
          {/* Enter components here, that you want to insert. */}
          <BrowserRouter>
            <Routes>
              {/* <Route path='/' element={<Dashboard name="Dashboard"/>}></Route> */}
              <Route path='/adjustment' element={<Adjustment/>}></Route>

              <Route path='/user' element={<User/>}></Route>
              <Route path="/newUser" element={<CreateUser/>}/>
              <Route path="/user/users/:ID" element={<EditUser/>}/>
              <Route path='/newadjustment' element={<NewAdjustment/>}></Route>
              <Route path='/adjustment/adj1' element={<AdjustmentDocument/>}></Route>
              <Route path='/inventoryRequest' element={<RequestList/>}></Route>
            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home
