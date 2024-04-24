import * as React from "react";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import {userReactToPrint}from "react-to-print"
import { useRef } from 'react'

const handlePrint = () => {
    document.print();
}

export default function BasicButtons(props) {
const{componentPDF}=props;
    componentPDF = useRef();
    const generatePDF = userReactToPrint({
        content:()=>componentPDF.current,
    });
    return (



        <div className="flex items-end justify-end p-6 mr-10">
            <button className="h-10 text-white bg-blue-600 w-36 rounded ..."
                onClick={generatePDF} >
                <LocalPrintshopIcon className='mr-1'></LocalPrintshopIcon>
                &nbsp;&nbsp;Print
            </button>
        </div>
    );
}