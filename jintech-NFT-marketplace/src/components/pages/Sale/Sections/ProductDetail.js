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
import React, { useEffect, useState } from "react";
import styles from "../Sale.module.css";
import BiddingModal from "./BiddingModal.js";
import BuyingModal from "./BuyingModal";

const ProductDetail = (props) => {
  const { Image } = props;
  console.log(Image);
  let isBidding = null;
  if (Image.type) {
    isBidding = Image?.type === "auction" ? true : false;
  }
  console.log(isBidding);
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
    if (isBidding) setValue("1");
  }, [isBidding]);

  return (
    <Box sx={{ mt: 1, pr: 2 }}>
      <div>
        <h4>{Image.filename}</h4>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex" }}>
          <Avatar src="/broken-image.jpg" />
          <div>
            <label>Creator</label>
            <br />
            <label>Some1</label>
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <Avatar src="/broken-image.jpg" />
          <div>
            <label>Owner</label>
            <br />
            <label>Some2</label>
          </div>
        </div>
      </div>
      <div>{Image.address}</div>
      <div>
        <Card
          sx={{
            mt: 2,
            mb: 2,
            p: 1,
            minHeight: "50px",
            maxHeight: "120px",
            overflow: "auto",
          }}
        >
          {Image.description}
          According to our idea, REAL BORED APE would look exactly like this.
          Have you ever seen this tough guy on the streets of your city? If you
          want to make friends with him, just make him smile:) Made by
          @nft.pride Curated by NFT Pride agency. Only the best and profitable
          NFT arts. @nft.pride
        </Card>
      </div>
      <div>
        <h5>Price</h5>
        {Image.price}
      </div>
      <br />
      {isBidding && (
        <div>
          <h5>Minimum Markup</h5>
          {Image.markup}
        </div>
      )}
      {isBidding && (
        <Grid container columns={10} spacing={2} sx={{ mt: 2, mb: 2 }}>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleBidClick}
              fullWidth
              sx={{ p: 2 }}
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
            >
              <div style={{ fontSize: "10px" }}>Buyout Price</div>
              <div style={{ fontSize: "12px" }}>
                <strong>120 ETH</strong>
              </div>
            </Button>
          </Grid>
        </Grid>
      )}
      {isBidding !== null && !isBidding && (
        <Button
          variant="contained"
          color="warning"
          sx={{ width: "70%", p: 2 }}
          fullWidth
          onClick={handleBuyClick}
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
        {isBidding && (
          <TabPanel value="1">
            <List sx={{ width: "100%", bgcolor: "background.paper" }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src="/broken-image.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <span style={{ fontSize: 14 }}>
                        <strong>Anonymous</strong>
                      </span>{" "}
                      <span style={{ fontSize: 3 }}>Place a Bids</span>
                    </>
                  }
                  secondary="Jan 9, 2014"
                />
                <ListItemText
                  sx={{ textAlign: "right" }}
                  primary={<span style={{ fontSize: 14 }}>4.45 BUSD</span>}
                  secondary=" ≈ $ 4.45"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src="/broken-image.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <span style={{ fontSize: 14 }}>
                        <strong>Anonymous</strong>
                      </span>{" "}
                      <span style={{ fontSize: 3 }}>Place a Bids</span>
                    </>
                  }
                  secondary="Jan 9, 2014"
                />
                <ListItemText
                  sx={{ textAlign: "right" }}
                  primary={<span style={{ fontSize: 14 }}>4.45 BUSD</span>}
                  secondary=" ≈ $ 4.45"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src="/broken-image.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <span style={{ fontSize: 14 }}>
                        <strong>Anonymous</strong>
                      </span>{" "}
                      <span style={{ fontSize: 3 }}>Place a Bids</span>
                    </>
                  }
                  secondary="Jan 9, 2014"
                />
                <ListItemText
                  sx={{ textAlign: "right" }}
                  primary={<span style={{ fontSize: 14 }}>4.45 BUSD</span>}
                  secondary=" ≈ $ 4.45"
                />
              </ListItem>
            </List>
          </TabPanel>
        )}
        <TabPanel value="2">
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
      <BiddingModal Open={BidOpen} handleClose={handleBidClose} Image={Image} />
      <BuyingModal Open={BuyOpen} handleClose={handleBuyClose} Image={Image} />
    </Box>
  );
};

export default ProductDetail;
