import React from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import RequestHandlerDashboard from "./RequestHandlerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import NewAdjustment from "./Adjustment/NewAdjustment";
import User from "./User/User";
import CreateUser from "./User/CreateUser";
import { Grid } from "@mui/material";
import AdjustmentDocument from "./Adjustment/AdjustmentDocument";
import ItemDataGrid from "./InventoryItem/ItemList";
import AddItemForm from "./InventoryItem/NewItem";
import ViewItemDetails from "./InventoryItem/ViewDetails";
import EditItem from "./InventoryItem/EditItem";
import AdminInRequestList from "./InventoryRequest/AdminInRequestList";
import AdminInRequestDocument from "./InventoryRequest/AdminInRequestDocument";
import InRequestHandlerRequestList from "./InventoryRequest/InRequestHandlerInRequestList";
import InRequestHandlerInRequestDocument from "./InventoryRequest/InRequestHandlerInRequestDocument";
import EmployeeInRequestList from "./InventoryRequest/EmployeeInRequestList";
import EmployeeInRequestDocument from "./InventoryRequest/EmployeeInRequestDocument";
import DeliveryRequestDocument from "./InventoryRequest/DeliveryRequestDocument";
import CreateNewRequest from "./InventoryRequest/CreateNewInRequest";
import EditRequest from "./InventoryRequest/EditInRequest";
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
import Usage from "./Report/ItemUsageAnalysis/UsageReport";
import LowStockReport from "./Report/LowStockReport";
import StockInDocument from "./StockIn/StockInDocument";
import NewStockIn from "./StockIn/NewStockIn";
import Userupdate from "./User/Edit_user";
import Ticket from "./Ticket/Ticketlist";
import ViewUser from "./User/Viewuser";
import NewStockOut from "./StockOut/NewStockOut";
import StockOutDocument from "./StockOut/StockOutDocument";
import R_admin from "./Reservation/R_admin";
import NewReservation from "./Reservation/NewReservation";
import TicketDocument from "./Ticket/Ticketdoc";
import InventorySummary from "./Report/InventorySummary";
import LoginPage from "./Login/LoginPage";
import LoginService from "./Login/LoginService";
import CreatePassword from "./User/CreatePassword";
import MyTicketList from "./Ticket/Myticketlist";
import SearchResult from "../components/SearchResult";
import ItemDetail from "../components/ItemDetail";
import ForgotPassword from "./Login/ForgotPassword";
import ResetPassword from "./Login/ResetPassword";
import EditTicket from "./Ticket/EditTicket";
 

const Home = () => {
  const isAuthenticated = LoginService.isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user/:id/password" element={<CreatePassword />}></Route>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
        <Route path="/resetPassword" element={<ResetPassword/>}></Route>
      </Routes>
      {isAuthenticated && (
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


              <Routes>
                {/* Enter components here, that you want to insert. */}

                {/* Dashboard routing */}
                <Route
                  path="/admin-dashboard"
                  element={<AdminDashboard />}
                ></Route>
                   <Route
                  path="/request-handler-dashboard"
                  element={<AdminDashboard />}
                ></Route>
                  <Route
                  path="/employee-dashboard"
                  element={<AdminDashboard />}
                ></Route>

                {/* Adjustment routing */}
                <Route path="/adjustment" element={<AdjustmentList />}></Route>
                <Route
                  path="/newadjustment"
                  element={<NewAdjustment />}
                ></Route>
                <Route
                  path="/adjustment/:adjId"
                  element={<AdjustmentDocument />}
                ></Route>
                <Route
                  path="/adjustment/editadjustment/:adjId"
                  element={<EditAdjustment />}
                ></Route>
                <Route
                  path="/newadjustment"
                  element={<NewAdjustment />}
                ></Route>
                <Route
                  path="/adjustment/adj1"
                  element={<AdjustmentDocument />}
                ></Route>

                {/* User routing */}
                <Route path="/user" element={<User />}></Route>
                <Route path="/newUser" element={<CreateUser />} />
                <Route path="/user/editUser/:ID" element={<Userupdate />} />
                <Route
                  path="/history/:userId"
                  element={<UserActivityHistory />}
                ></Route>
                <Route path="/user/users/:ID" element={<ViewUser />}></Route>

                {/* Ticket routing */}
                <Route path="/newTicket" element={<CreateTicket />}></Route>
                <Route path="/ticket" element={<Ticket />}></Route>
                <Route
                  path="ticket/ticketdoc/:id"
                  element={<TicketDocument />}
                ></Route>
                <Route path="/ticket/myticketlist/:userId" element={<MyTicketList/>}></Route>
                <Route path="/ticket/editticket/:id" element={<EditTicket/>}></Route>

                {/* Inventory Item routing */}

                <Route path="/item" element={<ItemDataGrid />}></Route>
                <Route path="/item/add-item" element={<AddItemForm />}></Route>
                <Route
                  path="/item/edit-item/:itemID"
                  element={<EditItem />}
                ></Route>
                <Route
                  path="/item/view-item/:itemID"
                  element={<ViewItemDetails />}
                ></Route>

                {/* Inventory Request routing */}
                {/*Admin view routing */}
                <Route
                  path="/admin-in-request-list"
                  element={<AdminInRequestList />}
                ></Route>
                <Route
                  path="/admin/in-request-document/:reqId"
                  element={<AdminInRequestDocument />}
                ></Route>
                {/*InRequest Handler view routing */}
                <Route
                  path="/in-requestHandler-in-request-list"
                  element={<InRequestHandlerRequestList />}
                ></Route>
                <Route
                  path="/in-request-handlerlist/in-request-document/:reqId"
                  element={<InRequestHandlerInRequestDocument />}
                ></Route>
                {/*Employee view routing */}
                <Route
                  path="/employee-in-request-list"
                  element={<EmployeeInRequestList />}
                ></Route>
                <Route
                  path="/employee/in-request-document/:reqId"
                  element={<EmployeeInRequestDocument />}
                ></Route>
                <Route
                  path="/employee/delivery-request-document/:reqId"
                  element={<DeliveryRequestDocument />}
                ></Route>
                {/*Common views for three actors rounting*/}
                <Route
                  path="/in-request/create-new-in-request"
                  element={<CreateNewRequest />}
                ></Route>
                <Route
                  path="/in-request/edit-request/:reqId"
                  element={<EditRequest />}
                ></Route>

                {/* Stock In routing */}
                <Route path="/stockIn" element={<StockInList />}></Route>
                <Route
                  path="/stockIn/:sinId"
                  element={<StockInDocument />}
                ></Route>
                <Route path="/new-stockin" element={<NewStockIn />}></Route>

                {/* Stock Out routing */}
                <Route path="/stockOut" element={<StockOutList />}></Route>
                <Route path="/new-stockout" element={<NewStockOut />}></Route>
                <Route
                  path="/stockOut/:soutId"
                  element={<StockOutDocument />}
                ></Route>

                {/*Initiate order routing*/}
                <Route path="/order" element={<OrderDataGrid />}></Route>
                <Route
                  path="/order/new-order"
                  element={<NewOrderForm />}
                ></Route>
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
                <Route
                  path="/report/low-stock-report"
                  element={<LowStockReport />}
                ></Route>
                <Route
                  path="/report/inventory-summary"
                  element={<InventorySummary />}
                ></Route>

                {/* Reservations routing */}
                <Route path="/reservation" element={<R_admin />}></Route>
                <Route
                  path="/newreservation"
                  element={<NewReservation />}
                ></Route>
                {/* SearchBar routing */}
                <Route path="/search-result" element={<SearchResult />}></Route>
                <Route path="/item-detail" element={<ItemDetail />} />
              </Routes>

            </Grid>
          </Grid>
        </div>
      )}
    </BrowserRouter>
  );
};

export default Home;
