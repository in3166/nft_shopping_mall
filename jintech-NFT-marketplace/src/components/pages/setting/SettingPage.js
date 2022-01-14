import { Box, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import Card from "../../UI/Card/Card";
import Category from "./Category/Category";
import styles from "./SettingPage.module.css";
import HomeIcon from "@mui/icons-material/Home";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SecurityIcon from "@mui/icons-material/Security";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CategoryIcon from "@mui/icons-material/Category";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Banner from "./Banner/Banner";
import AdminManager from "./AdminManager/AdminManager";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Box className={styles["tabpanel-box"]} sx={{ p: 3, width: "100%" }}>
          <Typography className="tabPanel-div" component="div">
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const SettingPage = () => {
  const [value, setValue] = useState(0);
  const mediumViewport = useMediaQuery("(min-width:768px)");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabsStyle = mediumViewport
    ? {
        borderRight: 1,
        borderColor: "divider",
        minWidth: "185px",
      }
    : {
        borderBottom: 1,
        borderColor: "divider",
        minWidth: "185px",
      };

  return (
    <Card>
      <Box
        className={styles.box}
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "100%",
          padding: "1rem 0.5rem 1rem 0.5rem",
        }}
      >
        <Tabs
          className={styles.tabs}
          orientation={mediumViewport ? "vertical" : "horizontal"}
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={tabsStyle}
        >
          <Tab
            label={
              <div>
                <HomeIcon style={{ verticalAlign: "middle" }} /> Home
              </div>
            }
            {...a11yProps(0)}
          />

          {/* <Tab
            label={
              <div>
                <AnalyticsIcon style={{ verticalAlign: "middle" }} /> Analysis
              </div>
            }
            {...a11yProps(1)}
          /> */}
          <Tab
            label={
              <div>
                <SecurityIcon style={{ verticalAlign: "middle" }} /> 2FA Manager
              </div>
            }
            {...a11yProps(1)}
          />
          <Tab
            label={
              <div>
                <ManageAccountsIcon style={{ verticalAlign: "middle" }} />
                Admin Manager
              </div>
            }
            {...a11yProps(2)}
          />
          <Tab
            label={
              <div>
                <CategoryIcon style={{ verticalAlign: "middle" }} />
                Category
              </div>
            }
            {...a11yProps(3)}
          />
          <Tab
            label={
              <div>
                <AppRegistrationIcon style={{ verticalAlign: "middle" }} />
                Banner
              </div>
            }
            {...a11yProps(4)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <h4>Home</h4>
          Item One
        </TabPanel>
        {/* <TabPanel value={value} index={1}>
          <h4>Analysis</h4>
          Item Two
        </TabPanel> */}
        <TabPanel value={value} index={1}>
          <h4>2FA Manager</h4>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={2}>
          <AdminManager />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Category />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Banner />
        </TabPanel>
      </Box>
    </Card>
  );
};

export default SettingPage;
