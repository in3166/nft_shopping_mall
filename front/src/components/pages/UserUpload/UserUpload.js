import { Divider, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Card from "../../UI/Card/Card";
import styles from "./UserUpload.module.css";
import UploadAuction from "./Sections/UploadAuction";
import UploadSale from "./Sections/UploadSale";
import { useSelector } from "react-redux";
import ImageContract from "../../../abis/ImageContract.json";

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

const UserUpload = (props) => {
  const { authChecked } = props;
  const history = useHistory();
  const user = useSelector((state) => state?.user?.user);
  const [Contract, setContract] = useState("");
  const [TotalSupply, setTotalSupply] = useState("");
  const [Address, setAddress] = useState("");
  const [NetworkId, setNetworkId] = useState("");
  const [Accounts, setAccounts] = useState("");

  const getAccount = useCallback(async () => {
    const accounts = await window.web3.eth.getAccounts();
    console.log(accounts[0]);
    setAccounts(accounts[0]);
    console.log("user: ", user);
    if (accounts && user.email !== "") {
      await axios
        .get(`/api/users/user/${user.email}`)
        .then(async (res) => {
          console.log("res : ", res.data.address);
          // user가 로그인 상태고 권한 체크가 완료된 상태
          if (user.isLoggedIn && authChecked) {
            if (accounts[0] !== res.data.address) {
              alert("지갑 주소가 맞지 않습니다.");
              history.replace("/");
              return;
            }

            const temp_networkId = await window.web3.eth.net.getId();
            const temp_networkData = ImageContract.networks[temp_networkId];
            if (temp_networkData) {
              const abi = ImageContract.abi;
              const temp_address = temp_networkData.address;
              const temp_contract = new window.web3.eth.Contract(
                abi,
                temp_address
              );
              console.log("contreact: ", temp_contract);
              const temp_totalSupply = await temp_contract.methods
                .totalSupply()
                .call();

              setContract(temp_contract);
              setTotalSupply(temp_totalSupply);
              setAddress(temp_address);
              setNetworkId(temp_networkId);
            }
          }
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
  }, [history, user, authChecked]);

  useEffect(() => {
    getAccount();
  }, [getAccount]);

  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Card>
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          border: "1px rgb(196, 196, 196) solid",
        }}
      >
        <h5 style={{ marginBottom: "0rem" }}>상품 등록</h5>
      </Box>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="primary tabs example"
        defaultChecked="1"
      >
        <Tab
          value={1}
          label={<span className={styles.tabLabel}>경매 등록</span>}
          {...a11yProps(0)}
        />
        <Tab
          value={2}
          label={<span className={styles.tabLabel}>판매 등록</span>}
          {...a11yProps(1)}
        />
      </Tabs>
      <Divider />
      <TabPanel value={value} index={1} user={user}>
        <UploadAuction
          networkId={NetworkId}
          totalSupply={TotalSupply}
          address={Address}
          contract={Contract}
          accounts={Accounts}
        />
      </TabPanel>
      <TabPanel value={value} index={2} user={user}>
        <UploadSale
          networkId={NetworkId}
          totalSupply={TotalSupply}
          address={Address}
          contract={Contract}
          accounts={Accounts}
        />
      </TabPanel>
    </Card>
  );
};

export default UserUpload;
