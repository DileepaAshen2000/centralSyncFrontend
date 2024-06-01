import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Stack, Select} from "@mui/material";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";

const CreatePassword= () => {
    return(
        <>
        <Box className='p-5 bg-white rounded-2xl w-[1122.7px]'>
      <Box className="pb-4">
        <h1 className="pt-2 pb-3 text-3xl font-bold ">passwordr</h1>
      </Box>
      </Box>
      </>

    );
};

export default CreatePassword;