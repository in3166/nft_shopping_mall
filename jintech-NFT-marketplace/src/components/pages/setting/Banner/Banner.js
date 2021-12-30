import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  NativeSelect,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import styles from "./Banner.module.css";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const Banner = () => {
  return (
    <>
      <Container sx={{ overflow: "hidden", display: "grid" }}>
        <h4>Banner</h4>
        <List
          sx={{
            flexDirection: "row",
            display: "flex",
            overflow: "scroll",
            marginBottom: "15px",
            padding: "0.5rem",
            border: "1px solid gainsboro",
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map(() => (
            <ListItem>
              <Card
                sx={{
                  maxWidth: 200,
                  maxHeight: 250,
                  width: 150,
                  height: 190,
                  position: "relative",
                }}
              >
                <CardHeader
                  action={
                    <IconButton aria-label="settings" size="small">
                      <CloseIcon />
                    </IconButton>
                  }
                  // title="Shrimp"
                  subheader="September"
                  sx={{ padding: "10px" }}
                />
                <Checkbox className={styles.checkbox} disableRipple />
                <img src="http://via.placeholder.com/640x360" alt="temp" />
              </Card>
            </ListItem>
          ))}
        </List>
        <br />
        <h5 style={{ float: "left" }}>Select IMAGES</h5>
        <Box sx={{ border: "1px solid gainsboro" }} padding={2}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "13px",
            }}
          >
            <div>
              <Button variant="outlined">
                <AddIcon />
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-around",
              }}
            >
              <FormControl sx={{ marginRight: "10px" }}>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Category
                </InputLabel>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    name: "age",
                    id: "uncontrolled-native",
                  }}
                >
                  <option value={10}>Ten</option>
                  <option value={20}>Twenty</option>
                  <option value={30}>Thirty</option>
                </NativeSelect>
              </FormControl>

              <TextField variant="standard" />
              <Button variant="outlined">검색</Button>
            </div>
          </div>
          <Grid container columns={18} spacing={2}>
            {[0, 1, 2, 3, 4, 5].map(() => {
              return (
                <Grid item xs={18} sm={9} md={6} lg={4.5}>
                  <Card>
                    <CardActionArea>
                      <Checkbox className={styles.checkbox} disableRipple />
                      <CardMedia
                        component="img"
                        height="140"
                        image="http://via.placeholder.com/640x360"
                        alt="green iguana"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          Lizard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Lizards are a widespread
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button size="small" color="primary">
                        Share
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Banner;
