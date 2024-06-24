import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const SearchResult = () => {
  const location = useLocation();
  const { searchResult } = location.state;
  const navigate = useNavigate();
  console.log(searchResult);

  const handleItemClick = (item) => {
    navigate("/item-detail", { state: { item } });
  };

  return (
    <List className="bg-white p-4 rounded-lg shadow-lg">
      {/* <Typography className="text-m font-semibold">Search results for "{item}"</Typography> */}
      {searchResult.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem
            alignItems="flex-start"
            className="flex-col md:flex-row items-start md:items-center"
            onClick={()=>handleItemClick(item)}
          >
            <ListItemAvatar className="mb-2 md:mb-0 md:mr-4">
              <Avatar
                alt={item.itemName}
                src={`data:image/*;base64,${item.image}`}
                className="w-16 h-16"
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography className="text-lg font-semibold">
                  {item.itemName}
                </Typography>
              }
              secondary={
                <div className="flex flex-col md:flex-row md:items-center">
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                    className="text-gray-700"
                  >
                    {item.brand}
                  </Typography>
                  
                  <Chip
                    label={item.itemGroup}
                    className="mt-2 md:mt-0 md:ml-4"
                  />
                </div>
              }
              className="w-full"
            />
          </ListItem>
          <Divider variant="inset" component="li" className="my-2" />
        </React.Fragment>
      ))}
    </List>
  );
};

export default SearchResult;

// import * as React from "react";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemText from "@mui/material/ListItemText";
// import Chip from "@mui/material/Chip";
// import Stack from "@mui/material/Stack";
// import { Divider } from "@mui/material";
// import { useLocation } from "react-router-dom";

// const SearchResult = () => {
//   const { searchResult } = useLocation().state;
//   return (
//     <>
//       {searchResult.map((item,index) => (
//         <Stack  direction="row" spacing={1}>
//         <Chip key={index} label={item.name}/>
//         </Stack>
//       ))}
//     </>
//   );
// };

// export default SearchResult;
