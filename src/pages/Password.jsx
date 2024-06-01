import React from "react";
import CreatePassword from "./User/CreatePassword";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Password= () => {
    return (
<BrowserRouter> 
<Routes>
    
<Route path="/user/createPassword" element={<CreatePassword/>}></Route>
</Routes>
</BrowserRouter> 
);
};

export default Password;