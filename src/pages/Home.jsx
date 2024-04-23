import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import AdminDashboard from './AdminDashboard'
import Adjustment from './Adjustment/Adjustment'
import NewAdjustment from './Adjustment/NewAdjustment'
import User from './User/User'
import CreateUser from './User/CreateUser'

import EditUser from '../components/UserEditForm'
import { Grid } from '@mui/material'
import AdjustmentDocument from './Adjustment/AdjustmentDocument'

import ItemDataGrid from './InventoryItem/InventoryItems'
import AddItemForm from './InventoryItem/NewItem'
import ViewItemDetails from './InventoryItem/ViewDetails'

import AdminInRequestList from './InventoryRequest/AdminInRequestList'
import AdminInRequestDocument from './InventoryRequest/AdminInRequestDocument'
import InRequestHandlerRequestList from './InventoryRequest/InRequestHandlerInRequestList'
import InRequestHandlerInRequestDocument from './InventoryRequest/InRequestHandlerInRequestDocument'
import EmployeeInRequestList from './InventoryRequest/EmployeeInRequestList'
import EmployeeInRequestDocument from './InventoryRequest/EmployeeInRequestDocument'
import CreateNewRequest from './InventoryRequest/CreateNewInRequest'
import EditRequest from './InventoryRequest/EditInRequest'

import EditAdjustment from './Adjustment/EditAdjustment'
import StockInList from './StockIn/StockInList'
import StockOutList from './StockOut/StockOutList'




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
          <BrowserRouter>
            <Routes>
              {/* Enter components here, that you want to insert. */}
              {/* Dashboard routing */}
              <Route path='/' element={<AdminDashboard/>}></Route>
              
              {/* Adjustment routing */}
              <Route path='/adjustment' element={<Adjustment/>}></Route>
              <Route path='/newadjustment' element={<NewAdjustment/>}></Route>
              <Route path='/adjustment/:adjId' element={<AdjustmentDocument/>}></Route>
              <Route path='/adjustment/editadjustment/:adjId' element={<EditAdjustment/>}></Route>
              <Route path='/newadjustment' element={<NewAdjustment/>}></Route>
              <Route path='/adjustment/adj1' element={<AdjustmentDocument/>}></Route>
              
              {/* User routing */}
              <Route path='/user' element={<User/>}></Route>
              <Route path="/newUser" element={<CreateUser/>}/>
              <Route path="/user/users/:ID" element={<EditUser/>}/>

              
              {/* Inventory Item routing */}
              <Route path='/item' element={<ItemDataGrid/>}></Route>
              <Route path='/item/add-item' element={<AddItemForm/>}></Route>
              <Route path='/item/edit-item/:ID' element={<ViewItemDetails/>}></Route>
              
              {/* Inventory Request routing */}
              {/*Admin view routing */}
              <Route path='/admin-in-request-list' element={<AdminInRequestList/>}></Route>
              <Route path='/admin/in-request-document/:reqId' element={<AdminInRequestDocument/>}></Route>
               {/*InRequest Handler view routing */}
              <Route path='/in-requestHandler-in-request-list' element={<InRequestHandlerRequestList/>}></Route>
              <Route path='/in-request-handler/in-request-document/:reqId' element={<InRequestHandlerInRequestDocument/>}></Route>
               {/*Employee view routing */}
               <Route path='/employee-in-request-list' element={<EmployeeInRequestList/>}></Route>
               <Route path='/employee/in-request-document/:reqId' element={<EmployeeInRequestDocument/>}></Route>
            {/*Common views for three actors rounting*/ }
              <Route path='/in-request/create-new-in-request' element={<CreateNewRequest/>}></Route>
              <Route path='/in-request/edit-request/:reqId' element={<EditRequest/>}></Route>

              {/* Stock In/Out routing */}
              <Route path='/stockIn' element={<StockInList/>}></Route>
              <Route path='/stockOut' element={<StockOutList/>}></Route>
              
            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home
