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
import EditUser from "../components/UserEditForm";
import { Grid } from "@mui/material";
import AdjustmentDocument from "./Adjustment/AdjustmentDocument";
import RequestList from "./InventoryRequest/InventoryRequestList";
import ItemDataGrid from "./InventoryItem/InventoryItems";
import AddItemForm from "./InventoryItem/NewItem";
import ViewItemDetails from "./InventoryItem/ViewDetails";
import ViewHistory from "./User/History";
import Changepassword from "./User/ChangePassword";
import { BrowserRouter as Router, Link } from "react-router-dom";

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
          {/* Enter components here, that you want to insert. */}
          <BrowserRouter>
            <Routes>
              {/* <Route path='/' element={<Dashboard name="Dashboard"/>}></Route> */}
              <Route path="/adjustment" element={<Adjustment />}></Route>
              
              <Route path="/user" element={<User />}></Route>
              <Route path="/newUser" element={<CreateUser />} />
              <Route path="/user/users/:ID" element={<EditUser />} />
              <Route path="/newadjustment" element={<NewAdjustment />}></Route>
              <Route
                path="/adjustment/adj1"
                element={<AdjustmentDocument />}
              ></Route>
              <Route path="/inventoryRequest" element={<RequestList />}></Route>
              <Route path="/item" element={<ItemDataGrid />}></Route>
              <Route path="/item/add-item" element={<AddItemForm />}></Route>
              <Route
                path="/item/edit-item/:ID"
                element={<ViewItemDetails />}
              ></Route>
              <Route path="/history" element={<ViewHistory />}></Route>
              <Route path="/changepassword" element={<Changepassword />}></Route>
            </Routes>
          </BrowserRouter>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
