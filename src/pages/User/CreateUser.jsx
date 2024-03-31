import React from "react";
import UserForm from "../../components/UserForm";
import NavBar from "../../components/NavBar";
import SideBar from "../../components/SideBar";

const CreateUser=()=>{
    return(
     
       
          <div>
            <h1 className="p-4 text-3xl font-bold">User</h1>
            <UserForm/>
          </div>
         
    )
}
export default CreateUser;