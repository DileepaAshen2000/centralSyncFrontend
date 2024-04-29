import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'reservationId', headerName: 'Reservation ID', width: 150 },
  { field: 'reservationItem', headerName: 'Reservation Item', width: 200},
  { field: 'reason', headerName: 'Reason', sortable:false, width: 250 },
  { field: 'duedate', headerName: 'Due Date', width: 200 },
  { field: 'status', headerName: 'Status', sortable: false}
];

const rows = [

];

export default function Table() {

  // const [rows,setRows] = useState([])
  // useEffect(() => {
  //   axios.get('http://localhost:8080/adjustment/getAll')
  //     .then((response) => {
     
  //     const data = response.data.map((res,index) => ({
  //       reservationId: index + 1,
  //       reservationItem: res.item,
  //       reason: res.reason,
  //       duedate: res.date,
  //       status: 'pending',
  //     }));
  //   setRows(data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [])

  return (
    <div>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}