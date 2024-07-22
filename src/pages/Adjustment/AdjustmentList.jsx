import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AdminAdjustment from './AdminAdjustment';
import UserAdjustment from './UserAdjustment';
import LoginService from '../Login/LoginService';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const isAdmin = LoginService.isAdmin();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {isAdmin && (
        <Box sx={{ width: '100%' }}>
          <div className='pb-5'>
            <h1 className="inline-block text-3xl font-bold">All Adjustment</h1>
            <p>Here are all Adjustment</p>
          </div>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="My Adjustments" {...a11yProps(0)} />
              <Tab label="Others" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <AdminAdjustment/>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <UserAdjustment/>
          </CustomTabPanel>
        </Box>
      )}
      
      {!isAdmin && (
        <div>
          <div className='pb-5'>
            <h1 className="inline-block text-3xl font-bold">All Adjustment</h1>
            <p>Here are all Adjustment</p>
          </div>
          <AdminAdjustment/>
        </div>
      )}
    </div>
  );
}
