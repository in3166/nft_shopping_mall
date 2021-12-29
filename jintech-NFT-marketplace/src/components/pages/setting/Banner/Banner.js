import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Container,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import styles from "./Banner.module.css";

const Banner = () => {
  return (
    <>
      <h4>Banner</h4>
      <Container sx={{ overflow: "hidden", display: "grid" }}>
        <List
          sx={{
            flexDirection: "row",
            display: "flex",
            overflow: "scroll",
            marginBottom: "5px",
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
                <Checkbox
                  style={{ position: "absolute", right: 0 }}
                  className={styles.checkbox}
                />
                <img src="http://via.placeholder.com/640x360" alt="temp" />
              </Card>
            </ListItem>
          ))}
        </List>

        <Box sx={{ border: "1px solid gainsboro" }} padding={2}>
          <div>
            <h5 style={{ float: "left" }}>
              <Checkbox />
              Select IMAGES
            </h5>
            <div style={{ float: "right" }}>
              <input />
            </div>
          </div>
          <Grid container columns={18} spacing={2}>
            {[0, 1, 2, 3, 4, 5].map(() => {
              return (
                <Grid item xs={18} sm={9} md={6} lg={4.5}>
                  <Card>
                    <CardActionArea>
                      <Checkbox
                        style={{ position: "absolute", right: 0 }}
                        className={styles.checkbox}
                      />
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
