import React, { useState } from "react";
import { Divider, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ProductsAnalysis from "./ProductsAnalysis/ProductsAnalysis";
import SalesAnalysis from "./SalesAnalysis/SalesAnalysis";
import UsersAnalysis from "./UsersAnalysis/UsersAnalysis";
import VisitsAnalysis from "./VisitsAnalysis/VisitsAnalysis";
import classes from "./Analysis.module.css";

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

const Analysis = () => {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
          label={<span className={classes.tabLabel}>매출 분석</span>}
          {...a11yProps(0)}
        />
        <Tab
          value={2}
          label={<span className={classes.tabLabel}>상품 분석</span>}
          {...a11yProps(1)}
        />
        <Tab
          value={3}
          label={<span className={classes.tabLabel}>방문 분석</span>}
          {...a11yProps(2)}
        />
        <Tab
          value={4}
          label={<span className={classes.tabLabel}>사용자 분석</span>}
          {...a11yProps(3)}
        />
      </Tabs>

      <Divider />
      <TabPanel value={value} index={1}>
        <SalesAnalysis />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ProductsAnalysis />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <VisitsAnalysis />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <UsersAnalysis />
      </TabPanel>
    </Box>
  );
};

export default Analysis;
