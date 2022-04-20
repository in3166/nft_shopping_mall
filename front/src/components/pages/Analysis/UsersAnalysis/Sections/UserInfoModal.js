import {
  Avatar,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { bidColumns, buyColumns, imageColumns, saleColumns } from "./columns";
import UserHistory from "./UserHistory";
import LoadingSpinner from "../../../../UI/Loading/LoadingSpinner";

const UserInfoModal = (props) => {
  const { user, setModalOpen, open } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [IsMount, setIsMount] = useState(true);
  console.log("user: ", user);

  const [value, setValue] = useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // 사용자 보유 이미지 가져오기
  const [userImages, setuserImages] = useState([]);
  const getUserImages = useCallback(async () => {
    axios
      .get("/api/marketplaces/myimages/" + user.email, {
        headers: { email: user.email },
      })
      .then((res) => {
        if (res.data.success && IsMount) {
          setuserImages(res.data.images);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [IsMount, user.email]);

  // 사용자 히스토리 가져오기
  const [BuyHisory, setBuyHisory] = useState([]);
  const [SaleHisory, setSaleHisory] = useState([]);
  const [BidHisory, setBidHisory] = useState([]);

  const getAllUserBuyHitories = useCallback(async () => {
    axios
      .get("/api/markethistories/buys/" + user.email)
      .then((res) => {
        if (res.data.success && IsMount) {
          setBuyHisory(res.data.buyHistory);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [user.email, IsMount]);

  const getAllSaleBuyHitories = useCallback(async () => {
    axios
      .get("/api/markethistories/sales/" + user.email)
      .then((res) => {
        if (res.data.success && IsMount) {
          setSaleHisory(res.data.saleHistory);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [user.email, IsMount]);

  const getAllBidBuyHitories = useCallback(async () => {
    axios
      .get("/api/markethistories/bids/" + user.email)
      .then((res) => {
        if (res.data.success && IsMount) {
          setBidHisory(res.data.bidHistory);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [user.email, IsMount]);

  const [Loading, setLoading] = useState(false);

  const allDataHandler = useCallback(async () => {
    setLoading(true);
    await getUserImages();
    await getAllUserBuyHitories();
    await getAllSaleBuyHitories();
    await getAllBidBuyHitories();
    setLoading(false);
  }, [
    getUserImages,
    getAllUserBuyHitories,
    getAllSaleBuyHitories,
    getAllBidBuyHitories,
  ]);

  useEffect(() => {
    allDataHandler();
    return () => {
      setIsMount(false);
    };
  }, [allDataHandler]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={() => setModalOpen(false)}
      aria-labelledby="responsive-dialog-title"
      fullWidth
      maxWidth="xl"
    >
      <DialogTitle id="responsive-dialog-title">{"상세 정보"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} columns={18}>
          <Grid item xs={10} sm={10}>
            <Box sx={{ mt: 1, pr: 2 }}>
              <TextField
                id="email"
                label="E-mail"
                defaultValue={user.email}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                sx={{ m: 1 }}
                fullWidth
              />
              <TextField
                id="address"
                label="Address"
                defaultValue={user.address}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ m: 1 }}
                variant="standard"
                fullWidth
              />
              <TextField
                id="created"
                label="생성일"
                defaultValue={user.created}
                InputProps={{
                  readOnly: true,
                }}
                title={user.url}
                sx={{ m: 1 }}
                variant="standard"
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={18}>
            {Loading && <LoadingSpinner />}
            {!Loading && (
              <Box
                sx={{
                  p: 2,
                  mt: 0,
                  border: "1px rgb(185, 185, 185) solid",
                  borderRadius: 2,
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="primary"
                  indicatorColor="primary"
                  aria-label="primary tabs example"
                  defaultChecked="1"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab
                    value={1}
                    label={<span>보유 상품</span>}
                    {...a11yProps(0)}
                  />
                  <Tab
                    value={2}
                    label={<span>구매 이력</span>}
                    {...a11yProps(1)}
                  />
                  <Tab
                    value={3}
                    label={<span>판매 이력</span>}
                    {...a11yProps(2)}
                  />
                  <Tab
                    value={4}
                    label={<span>경매 이력</span>}
                    {...a11yProps(3)}
                  />
                </Tabs>

                <Divider />
                <TabPanel value={value} index={1}>
                  <UserHistory rows={userImages} columns={imageColumns} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <UserHistory rows={BuyHisory} columns={buyColumns} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <UserHistory rows={SaleHisory} columns={saleColumns} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <UserHistory rows={BidHisory} columns={bidColumns} />
                </TabPanel>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => setModalOpen(false)}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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

export default UserInfoModal;
