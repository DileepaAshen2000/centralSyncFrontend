import * as React from "react";
import Button from "@mui/material/Button";




export default function BasicButtons(props) {
    const {children} = props;
    return (

        <Button className="bg-blue-500 text-white w-40 h-15 m-0">
            {children}
        </Button>
    );
}