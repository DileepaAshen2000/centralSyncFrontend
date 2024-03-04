import * as React from "react";
import Button from "@mui/material/Button";




export default function BasicButtons(props) {
    const {children} = props;
    const {icon}=props;
    return (
        <Button style={{ backgroundColor: '#007EF2' }}
            className='px-6 py-2 text-white rounded'
            variant="contained"
            sx={{
                textTransform: 'none',
                whiteSpace: '10px 20px',
            }}>
            {children}
        </Button>
    );
}