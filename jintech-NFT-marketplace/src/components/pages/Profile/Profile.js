import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";

import React, { useState } from "react";
import Card from "../../UI/Card/Card";
import classes from "./Profile.module.css";
import UserFrom from "./UserForm";
import LeaveUser from "./LeaveUser";
import SecondAuthentication from "./SecondAuthentication";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

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
          <Typography component="div">{children}</Typography>
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

const Profile = (props) => {
  const [value, setValue] = useState(1);
  console.log("profile");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card>
      <Box sx={{ p: 2, mt: 0 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          defaultChecked="1"
          variant="scrollable"
          scrollButtons="auto"
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
          <Tab
            value={4}
            label={<span className={classes.tabLabel}>2차 인증</span>}
            {...a11yProps(3)}
          />
          <Tab
            value={5}
            label={<span className={classes.tabLabel}>회원 탈퇴</span>}
            {...a11yProps(4)}
          />
        </Tabs>
      </Box>
      <Divider />
      <TabPanel value={value} index={1}>
        <UserFrom user={props.user} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={4}>
        <SecondAuthentication value={value} user={props.user} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <LeaveUser user={props.user} />
      </TabPanel>
    </Card>
  );
};

export default Profile;
