
import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//import Dashboard from './Dashboard'
import Adjustment from "./Adjustment/Adjustment";
import NewAdjustment from "./Adjustment/NewAdjustment";
import User from "./User/User";
import CreateUser from "./User/CreateUser";
import Userupdate from "./User/Edit_user";
import EditUser from "../components/User_Components/UserEditForm";
import { Grid } from "@mui/material";
import AdjustmentDocument from "./Adjustment/AdjustmentDocument";
import RequestList from "./InventoryRequest/InventoryRequestList";
import ItemDataGrid from "./InventoryItem/InventoryItems";
import AddItemForm from "./InventoryItem/NewItem";
import ViewItemDetails from "./InventoryItem/ViewDetails";
import ViewHistory from "./User/History";
import Changepassword from "./User/ChangePassword";
import TicketForm from "../components/Ticket_Create";
import { BrowserRouter as Router, Link } from "react-router-dom"; 
import RequestDocumentPending from './InventoryRequest/RequestDocumentPending'
import RequestDocumentAccept from './InventoryRequest/RequestDocumentAccept'
import RequestDocumentReject from './InventoryRequest/RequestDocumentReject'
import CreateNewRequest from './InventoryRequest/CreateNewRequest'
import EditRequest from './InventoryRequest/EditRequest'
import EditAdjustment from './Adjustment/EditAdjustment'
import StockInList from './StockIn/StockInList'
import StockOutList from './StockOut/StockOutList'


const Home = () => {
  return (
    <div>
      <div>
      <Router>
        <NavBar />
      </Router>
      </div>
      <Grid container className="flex">
        <Grid
          item
          sm={2.5}
          className="box-border hidden h-screen md:block w-96"
        >
          <SideBar></SideBar>
        </Grid>

        <Grid
          item
          sm={9.5}
          style={{ backgroundColor: "#eeeeee" }}
          className="w-screen p-10"
        >
          
           
              
              
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
              <Route path='/inventoryRequest' element={<RequestList/>}></Route>
              <Route path='/inventory-request' element={<RequestList/>}></Route>
              <Route path='/inventory-request/request-document-pending' element={<RequestDocumentPending/>}></Route>
              <Route path='/inventory-request/request-document-accept' element={<RequestDocumentAccept/>}></Route>
              <Route path='/inventory-request/request-document-reject' element={<RequestDocumentReject/>}></Route>
              <Route path='/inventory-request/create-new-request' element={<CreateNewRequest/>}></Route>
              <Route path='/inventory-request/edit-request' element={<EditRequest/>}></Route>

              {/* Stock In/Out routing */}
              <Route path='/stockIn' element={<StockInList/>}></Route>
              <Route path='/stockOut' element={<StockOutList/>}></Route>

              <Route path="/history" element={<ViewHistory />}></Route>
              <Route path="/changepassword" element={<Changepassword />}></Route>
              <Route path="/newTicket" element={<TicketForm/>}></Route>
              
            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
