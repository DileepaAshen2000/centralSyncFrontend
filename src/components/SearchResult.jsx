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
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

const SearchResult = () => {
  const location = useLocation();
  const { searchResult = [], currentRoute, searchTerm } = location.state;
  const navigate = useNavigate();
  console.log(currentRoute);

  const handleItemClick = (item) => {
    navigate("/item-detail", { state: { item } });
  };
  const handleCloseClick = (event) => {
    event.stopPropagation(); // Prevent click event from propagating to parent elements
    if (searchResult == null) {
      navigate("/");
    } else {
      navigate(currentRoute);
    }
  };

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-lg">
      <div>
        <IconButton
          onClick={(e) => handleCloseClick(e)}
          className="absolute top-0 right-0 m-2 "
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </div>
      <div>
        <List>
          <Typography className="text-m font-semibold">
            Search results for "{searchTerm}"
          </Typography>
          {searchResult.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                className="flex-col md:flex-row items-start md:items-center"
                onClick={() => handleItemClick(item)}
              >
                <ListItemAvatar className="mb-2 md:mb-0 md:mr-4">
                  <Avatar
                    alt={item.itemName}
                    src={item.image && `data:image/*;base64,${item.image}`}
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
      </div>
    </div>
  );
};

export default SearchResult;
