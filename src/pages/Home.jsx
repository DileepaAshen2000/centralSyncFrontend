import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import NewAdjustment from "./Adjustment/NewAdjustment";
import User from "./User/User";
import CreateUser from "./User/CreateUser";
import EditUser from "../components/UserEditForm";
import { Grid } from "@mui/material";
import AdjustmentDocument from "./Adjustment/AdjustmentDocument";
import ItemDataGrid from "./InventoryItem/ItemList";
import AddItemForm from "./InventoryItem/NewItem";
import ViewItemDetails from "./InventoryItem/ViewDetails";
import EditItem from "./InventoryItem/EditItem";

import AdminInRequestList from './InventoryRequest/AdminInRequestList'
import AdminInRequestDocument from './InventoryRequest/AdminInRequestDocument'
import InRequestHandlerRequestList from './InventoryRequest/InRequestHandlerInRequestList'
import InRequestHandlerInRequestDocument from './InventoryRequest/InRequestHandlerInRequestDocument'
import EmployeeInRequestList from './InventoryRequest/EmployeeInRequestList'
import EmployeeInRequestDocument from './InventoryRequest/EmployeeInRequestDocument'
import WorkFromHomeRequestDocument from './InventoryRequest/WorkFromHomeRequestDocument'
import CreateNewRequest from './InventoryRequest/CreateNewInRequest'
import EditRequest from './InventoryRequest/EditInRequest'

import UserActivityHistory from "./User/History";
import EditAdjustment from "./Adjustment/EditAdjustment";
import StockInList from "./StockIn/StockInList";
import StockOutList from "./StockOut/StockOutList";
import AdjustmentList from "./Adjustment/AdjustmentList";
import OrderDataGrid from "./InitiateOrder/OrderList";
import NewOrderForm from "./InitiateOrder/NewOrder";
import ViewOrderDetails from "./InitiateOrder/ViewOrder";
import EditOrderDetails from "./InitiateOrder/EditOrder";
import Usage from "./UsageReport/UsageReport";
import StockInDocument from "./StockIn/StockInDocument";
import NewStockIn from "./StockIn/NewStockIn";
import NewStockOut from "./StockOut/NewStockOut";
import StockOutDocument from "./StockOut/StockOutDocument";

const Home = () => {
  return (
    <div>
      <div>
        <NavBar />
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
          <BrowserRouter>
            <Routes>
              {/* Enter components here, that you want to insert. */}
              {/* Dashboard routing */}
              <Route path="/" element={<AdminDashboard />}></Route>

              {/* Adjustment routing */}
              <Route path="/adjustment" element={<AdjustmentList />}></Route>
              <Route path="/newadjustment" element={<NewAdjustment />}></Route>
              <Route
                path="/adjustment/:adjId"
                element={<AdjustmentDocument />}
              ></Route>
              <Route
                path="/adjustment/editadjustment/:adjId"
                element={<EditAdjustment />}
              ></Route>
              <Route path="/newadjustment" element={<NewAdjustment />}></Route>
              <Route
                path="/adjustment/adj1"
                element={<AdjustmentDocument />}
              ></Route>

              {/* User routing */}
              <Route path="/user" element={<User />}></Route>
              <Route path="/newUser" element={<CreateUser />} />
              <Route path="/user/users/:ID" element={<EditUser />} />
              <Route path="/history" element={<UserActivityHistory />}></Route>

              {/* Inventory Item routing */}

              <Route path="/item" element={<ItemDataGrid />}></Route>
              <Route path="/item/add-item" element={<AddItemForm />}></Route>
              <Route path="/item/edit-item/:itemID" element={<EditItem />}></Route>
              <Route
                path="/item/view-item/:itemID"
                element={<ViewItemDetails />}
              ></Route>

              {/* Inventory Request routing */}
              {/*Admin view routing */}
              <Route path='/admin-in-request-list' element={<AdminInRequestList/>}></Route>
              <Route path='/admin/in-request-document/:reqId' element={<AdminInRequestDocument/>}></Route>
               {/*InRequest Handler view routing */}
              <Route path='/in-requestHandler-in-request-list' element={<InRequestHandlerRequestList/>}></Route>
              <Route path='/in-request-handlerlist/in-request-document/:reqId' element={<InRequestHandlerInRequestDocument/>}></Route>
               {/*Employee view routing */}
               <Route path='/employee-in-request-list' element={<EmployeeInRequestList/>}></Route>
               <Route path='/employee/in-request-document/:reqId' element={<EmployeeInRequestDocument/>}></Route>
               <Route path='/employee/workfromhome-in-request-document/:reqId' element={<WorkFromHomeRequestDocument/>}></Route>
              {/*Common views for three actors rounting*/ }
              <Route path='/in-request/create-new-in-request' element={<CreateNewRequest/>}></Route>
              <Route path='/in-request/edit-request/:reqId' element={<EditRequest/>}></Route>


              {/* Stock In routing */}
              <Route path="/stockIn" element={<StockInList />}></Route>
              <Route path="/stockIn/:sinId" element={<StockInDocument/>}></Route>
              <Route path="/new-stockin" element={<NewStockIn/>}></Route>

              {/* Stock Out routing */}
              <Route path="/stockOut" element={<StockOutList />}></Route>
              <Route path="/new-stockout" element={<NewStockOut/>}></Route>
              <Route path="/stockOut/:soutId" element={<StockOutDocument/>}></Route>

              {/*Initiate order routing*/}
              <Route path="/order" element={<OrderDataGrid />}></Route>
              <Route path="/order/new-order" element={<NewOrderForm />}></Route>
              <Route
                path="/order/view-order/:orderID"
                element={<ViewOrderDetails />}
              ></Route>
              <Route
                path="/order/edit-order/:orderID"
                element={<EditOrderDetails />}
              ></Route>
 {/*Reports routing*/}
 <Route
                path="/report/item-usage-analysis"
                element={<Usage />}
              ></Route>


            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
