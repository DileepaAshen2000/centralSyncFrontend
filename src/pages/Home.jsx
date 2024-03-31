import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
//import Dashboard from './Dashboard'
import Adjustment from './Adjustment/Adjustment'
import NewAdjustment from './Adjustment/NewAdjustment'
import { Grid } from '@mui/material'
import AdjustmentDocument from './Adjustment/AdjustmentDocument'
import RequestList from './InventoryRequest/InventoryRequestList'
import ItemDataGrid from './InventoryItem/ItemList'
import AddItemForm from './InventoryItem/NewItem'
import EditItem from './InventoryItem/EditItem'
import ViewItemDetails from './InventoryItem/ViewDetails'
import Usage from './Reports/UsageReport/UsageReport'
import OrderDataGrid from './InitiateOrder/OrderList'
import NewOrderForm from './InitiateOrder/NewOrder'
import ViewOrderDetails from './InitiateOrder/ViewOrder'
import EditOrderDetails from './InitiateOrder/EditOrder'



const Home = () => {
  return (
    <div>
      <div>
        <NavBar></NavBar>
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
              <Route path='/newadjustment' element={<NewAdjustment/>}></Route>
              <Route path='/adjustment/adj1' element={<AdjustmentDocument/>}></Route>
              <Route path='/inventoryRequest' element={<RequestList/>}></Route>
              <Route path='/item' element={<ItemDataGrid/>}></Route>
              <Route path='/item/add-item' element={<AddItemForm/>}></Route>
              <Route path='/item/view-item/:ID' element={<ViewItemDetails/>}></Route>
              <Route path='/item/edit-item/:ID' element={<EditItem/>}></Route>
              <Route path='/report/item-usage-analysis' element={<Usage/>}></Route>
              <Route path='/order' element={<OrderDataGrid/>}></Route>
              <Route path='/order/new-order' element={<NewOrderForm/>}></Route>
              <Route path='/order/view-order/:ID' element={<ViewOrderDetails/>}></Route>
              <Route path='/order/edit-order/:ID' element={<EditOrderDetails/>}></Route>
            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </div>
  )
}

export default Home
