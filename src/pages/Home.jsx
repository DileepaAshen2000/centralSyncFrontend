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
import RequestList from "./InventoryRequest/RequestsList";
import AdminRequestList from "./InventoryRequest/AdminRequestList";
import RequestDocumentPending from "./InventoryRequest/RequestDocumentPending";
import CreateNewRequest from "./InventoryRequest/CreateNewRequest";
import EditRequest from "./InventoryRequest/EditRequest";
import UserActivityHistory from "./User/History";
import EditAdjustment from "./Adjustment/EditAdjustment";
import StockInList from "./StockIn/StockInList";
import StockOutList from "./StockOut/StockOutList";
import AdjustmentList from "./Adjustment/AdjustmentList";
import OrderDataGrid from "./InitiateOrder/OrderList";
import CreateTicket from "./Ticket/CreateTicket";
import NewOrderForm from "./InitiateOrder/NewOrder";
import ViewOrderDetails from "./InitiateOrder/ViewOrder";
import EditOrderDetails from "./InitiateOrder/EditOrder";
import Usage from "./UsageReport/UsageReport";
import StockInDocument from "./StockIn/StockInDocument";
import NewStockIn from "./StockIn/NewStockIn";
import Userupdate from "./User/Edit_user";

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
              <Route path="/user/editUser/:ID" element={<Userupdate />} />
              <Route path="/history" element={<UserActivityHistory />}></Route>
              <Route path='/newTicket' element={<CreateTicket/>}></Route>

              {/* Inventory Item routing */}
 

              <Route path="/item" element={<ItemDataGrid />}></Route>
              <Route path="/item/add-item" element={<AddItemForm />}></Route>
              <Route path="/item/edit-item/:ID" element={<EditItem />}></Route>
              <Route
                path="/item/view-item/:ID"
                element={<ViewItemDetails />}
              ></Route>

              {/* Inventory Request routing */}
              <Route path="/inventoryRequest" element={<RequestList />}></Route>
              <Route
                path="/inventory-request"
                element={<RequestList />}
              ></Route>
              <Route
                path="/admin-inventory-request-list"
                element={<AdminRequestList />}
              ></Route>
              <Route
                path="/inventory-request/request-document-pending"
                element={<RequestDocumentPending />}
              ></Route>
              <Route
                path="/inventory-request/create-new-request"
                element={<CreateNewRequest />}
              ></Route>
              <Route
                path="/inventory-request/edit-request"
                element={<EditRequest />}
              ></Route>

              {/* Stock In routing */}
              <Route path="/stockIn" element={<StockInList />}></Route>
              <Route path="/stockIn/:sinId" element={<StockInDocument/>}></Route>
              <Route path="/new-stockin" element={<NewStockIn/>}></Route>

              {/* Stock Out routing */}
              <Route path="/stockOut" element={<StockOutList />}></Route>

              {/*Initiate order routing*/}
              <Route path="/order" element={<OrderDataGrid />}></Route>
              <Route path="/order/new-order" element={<NewOrderForm />}></Route>
              <Route
                path="/order/view-order/:ID"
                element={<ViewOrderDetails />}
              ></Route>
              <Route
                path="/order/edit-order/:ID"
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
