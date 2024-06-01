import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePassword from "./pages/User/CreatePassword";
//import FileTest from "./components/fileTest";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/set-password" element={<CreatePassword />} />
        {/*<Route path="/file-test" element={<FileTest />} />*/}
      </Routes>
    </Router>
  );
};

export default App;
