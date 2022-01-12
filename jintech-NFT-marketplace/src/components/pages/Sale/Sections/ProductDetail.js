import {
  TabContext,
  TabList,
  TabPanel,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import styles from "../Sale.module.css";
import BiddingModal from "./BiddingModal.js";
import BuyingModal from "./BuyingModal";
import Countdown from "react-countdown";
import SearchOffIcon from "@mui/icons-material/SearchOff";

const ProductDetail = (props) => {
  const { Image, setImage } = props;
  const [History, setHistory] = useState([]);
  const [CountDate, setCountDate] = useState(0);
  const [EndTime, setEndTime] = useState(false);

  const [HistoryViewEnd, setHistoryViewEnd] = useState(3);

  let isBidding = null;
  if (Image.type) {
    isBidding = Image?.type === "auction" ? true : false;
  }

  const getAllBidHistory = useCallback(() => {
    axios
      .get("/api/marketHistories/" + Image.id)
      .then((res) => {
        if (res.data.success) {
          setHistory(res.data.history);
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        alert(err);
      });
  }, [Image.id]);

  const [value, setValue] = useState(isBidding ? "1" : "2");

  const [BidOpen, setBidOpen] = useState(false);
  const handleBidClose = () => {
    setBidOpen(false);
  };

  const [BuyOpen, setBuyOpen] = useState(false);
  const handleBuyClose = () => {
    setBuyOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleBidClick = () => {
    setBidOpen(true);
  };

  const handleBuyClick = () => {
    setBuyOpen(true);
  };

  useEffect(() => {
    if (isBidding) {
      setValue("1");
      getAllBidHistory();
    }
    if (Image.image) {
      setCountDate(
        new Date(Image.starting_time).getTime() +
          Image.limit_hours * 60 * 60 * 1000
      );
    }
    if (CountDate !== 0 && CountDate < Date.now()) {
      setEndTime(true);
    }
  }, [isBidding, getAllBidHistory, Image, CountDate]);

  if (Image.image === undefined) {
    return <>Loading...</>;
  }

  const countRenderer = (data) => {
    // Render a countdown
    // const f_hour = Math.floor(hours / 10);
    // const b_hour = Math.floor(hours % 10);
    // const f_minutes = Math.floor(minutes / 10);
    // const b_minutes = Math.floor(minutes % 10);
    // const f_seconds = Math.floor(seconds / 10);
    // const b_seconds = Math.floor(seconds % 10);
    if (!data.total) {
      setEndTime(true);
    }

    return (
      <span className={styles["count_container"]}>
        <span className={styles["count_item"]}>{data.formatted.days}</span>:
        <span className={styles["count_item"]}>{data.formatted.hours}</span>:
        <span className={styles["count_item"]}>{data.formatted.minutes}</span>:
        <span className={styles["count_item"]}>{data.formatted.seconds}</span>
      </span>
    );
  };

  const handleMoreClick = () => {
    if (HistoryViewEnd + 5 >= History.length) {
      setHistoryViewEnd(History.length);
    } else {
      setHistoryViewEnd((prev) => prev + 5);
    }
  };

  return (
    <Box sx={{ mt: 1, pr: 2 }}>
      <div>
        <h5>{Image.image.filename}</h5>
      </div>
      <div style={{ display: "flex", paddingTop: 20, paddingBottom: 14 }}>
        {/* <div style={{ display: "flex" }}>
          <Avatar src="/broken-image.jpg" />
          <div style={{ marginLeft: 10, lineHeight: 1, paddingTop: 2 }}>
            <label style={{ fontWeight: "bold" }}>Creator</label>
            <br />
            <label>Someone</label>
          </div>
        </div> */}
        <div style={{ display: "flex", marginLeft: 5 }}>
          <Avatar src="/broken-image.jpg" />
          <div style={{ marginLeft: 10, lineHeight: 1, paddingTop: 2 }}>
            <label style={{ fontWeight: "bold" }}>Owner</label>
            <br />
            <label>{Image.ownerEmail}</label>
          </div>
        </div>
      </div>
      <div>{Image.address}</div>
      <div>
        <Card
          sx={{
            mt: 2,
            mb: 3,
            p: 1,
            minHeight: "50px",
            maxHeight: "120px",
            overflow: "auto",
          }}
        >
          {Image.image.description}
        </Card>
      </div>
      <div>
        <h5>Price</h5>
        {Image.current_price.toLocaleString("ko-KR")} ETH
      </div>
      <br />
      {isBidding !== null && isBidding && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h5>Minimum Markup</h5>
            {Image?.image?.markup?.toLocaleString("ko-KR")} ETH
          </div>
        </div>
      )}
      <div className={styles.countDown}>
        <Countdown
          date={
            new Date(Image.starting_time).getTime() +
            Image.limit_hours * 60 * 60 * 1000
          }
          renderer={countRenderer}
        />
      </div>
      {isBidding !== null && isBidding && (
        <Grid container columns={10} spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleBidClick}
              fullWidth
              sx={{ p: 2 }}
              disabled={Image.soldOut || EndTime ? true : false}
            >
              Place a Bid
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              onClick={handleBuyClick}
              sx={{ p: 1, flexDirection: "column" }}
              disabled={Image.soldOut || EndTime ? true : false}
            >
              <div style={{ fontSize: "10px" }}>Buyout Price</div>
              <div style={{ fontSize: "12px" }}>
                <strong>
                  {Image.image.buyout.toLocaleString("ko-KR")} ETH
                </strong>
              </div>
            </Button>
          </Grid>
        </Grid>
      )}
      {isBidding !== null && !isBidding && (
        <Button
          variant="contained"
          color="warning"
          sx={{ width: "100%", p: 2 }}
          fullWidth
          onClick={handleBuyClick}
          disabled={Image.soldOut || EndTime ? true : false}
        >
          Buy Now
        </Button>
      )}

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            textColor="inherit"
            indicatorColor="secondary"
          >
            {isBidding && <Tab label="Bid History" value="1" />}
            <Tab label="Provenance" value="2" />
          </TabList>
        </Box>

        {isBidding !== null && isBidding && (
          <TabPanel value="1" className={styles["tab-panel"]}>
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              {History.length === 0 && (
                <ListItem className={styles.empty}>
                  <SearchOffIcon className={styles.icon} /> No Items.
                </ListItem>
              )}
              {History.length > 0 &&
                History.filter((value, index) => index < HistoryViewEnd).map(
                  (history, index) => (
                    <ListItem key={history.id}>
                      <ListItemAvatar>
                        <Avatar src="/broken-image.jpg" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <span style={{ fontSize: 14 }}>
                              <strong>{history.userEmail}</strong>
                            </span>
                            <span style={{ fontSize: 3 }}>
                              {history.action === "bid"
                                ? " Place a bid"
                                : " Buyout"}
                            </span>
                          </>
                        }
                        secondary={new Date(history.createdAt).toLocaleString()}
                      />
                      <ListItemText
                        sx={{ textAlign: "right" }}
                        primary={
                          <span style={{ fontSize: 14 }}>
                            {history.price.toLocaleString("ko-KR")} ETH
                          </span>
                        }
                        secondary=" ≈ $ ---"
                      />
                    </ListItem>
                  )
                )}
              {HistoryViewEnd < History.length && (
                <div style={{ width: "100%", textAlign: "center" }}>
                  <button onClick={handleMoreClick}>Viwe More</button>
                </div>
              )}
            </List>
          </TabPanel>
        )}
        <TabPanel value="2" className={styles["tab-panel"]}>
          <Timeline className={styles.timeline}>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="warning" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h7" component="span">
                  <strong>Listed by @Owner</strong>
                </Typography>
                <Typography fontSize={12}>2022-02-17 15:32</Typography>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="warning" />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h7" component="span">
                  <strong>Listed by @Owner</strong>
                </Typography>
                <Typography fontSize={12}>2022-02-17 15:32</Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </TabPanel>
      </TabContext>
      {isBidding !== null && isBidding && (
        <BiddingModal
          Open={BidOpen}
          setImage={setImage}
          handleClose={handleBidClose}
          Image={Image}
          getAllBidHistory={getAllBidHistory}
          EndTime={EndTime}
        />
      )}
      {isBidding !== null && (
        <BuyingModal
          EndTime={EndTime}
          Open={BuyOpen}
          setImage={setImage}
          handleClose={handleBuyClose}
          Image={Image}
        />
      )}
    </Box>
  );
};

export default ProductDetail;
