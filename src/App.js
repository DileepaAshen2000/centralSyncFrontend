import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   BrowserRouter,
// } from "react-router-dom";
import Home from "./pages/Home";
import CreatePassword from "./pages/User/CreatePassword";
//import FileTest from "./components/fileTest";
import LoginPage from "./pages/Login/LoginPage";

const App = () => {
  return (
    <div>
      <Home />

      {/* <LoginPage/> */}
      {/*<Router>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/user/:id/password" element={<CreatePassword />} />
        </Routes>
    </Router>*/}
    </div>
  );
};

export default App;
