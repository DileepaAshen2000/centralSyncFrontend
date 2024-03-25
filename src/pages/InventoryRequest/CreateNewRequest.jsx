import React from "react";
import NewRequestForm from '../../components/InventoryRequest/NewRequestForm';


const CreateNewRequest=()=>{
    return(
     
       
          <div>
            <h1 className="p-4 text-2xl my-4 font-medium">New Request</h1>
            <NewRequestForm/>
          </div>
         
    )
}
export default CreateNewRequest;