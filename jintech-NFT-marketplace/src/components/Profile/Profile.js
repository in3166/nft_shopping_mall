import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";

import React, { useState } from "react";
import Card from "../UI/Card/Card";
import classes from "./Profile.module.css";
import UserFrom from "./UserForm";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  console.log(value, index);
  console.log(+value === +index);
  console.log(children);
  return (
    <div
      role="tabpanel"
      hidden={+value !== +index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {+value === +index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Profile = () => {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Card>
      <Box sx={{ p: 2, mt: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          defaultChecked="1"
        >
          <Tab
            value={1}
            label={<span className={classes.tabLabel}>회원 정보</span>}
            {...a11yProps(0)}
          />
          <Tab
            value={2}
            label={<span className={classes.tabLabel}>구매 이력</span>}
            {...a11yProps(1)}
          />
          <Tab
            value={3}
            label={<span className={classes.tabLabel}>판매 이력</span>}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <Divider />
      <TabPanel value={value} index={1}>
        <UserFrom />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Three
      </TabPanel>
    </Card>
  );
};

export default Profile;
