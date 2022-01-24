import React from "react";

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
  Card,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import styles from "./InfoModal.module.css";
import { create } from "ipfs-http-client";
import IP from "../../../../ipconfig.json";
import axios from "axios";
import ImageContract from "../../../../abis/ImageContract.json";
import { useSelector } from "react-redux";
import Crypto from "crypto";

const InfoModal = (props) => {
  const { open, handleClose, selectedData } = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const user = useSelector((state) => state.user.user);

  const getBase64 = (file, cb) => {
    // console.log("file: ");
    // console.log(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const handleMintSubmit = async () => {
    console.log(selectedData);
    const Web3 = require("web3");
    // web3 lib instance
    const web3 = new Web3(window.ethereum);
    // Load account
    const accounts = await web3.eth.getAccounts();
    //this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const networkData = ImageContract.networks[networkId];
    const abi = ImageContract.abi;
    const address = networkData.address;
    const contract = new web3.eth.Contract(abi, address); // ImageContract 주소

    const totalSupply = await contract.methods.totalSupply().call();
    console.log("totalSupply: ", totalSupply);

    // ipfs에서 이미지 불러오기
    axios
      .get(selectedData.url, { responseType: "blob" })
      .then((res) => {
        console.log(res.data);
        let file = new File([res.data], selectedData.filename);
        // file: name(생성시간 포함), size, type만 존재
        // formandpreview에선 lastModified, lastModifiedDate, webkitRelativePath 포함되어서 mint
        console.log(file);
        const body = {
          key: totalSupply,
          id: selectedData.id,
        };
        console.log("body: ", body);
        // key 추가
        axios
          .put("/api/images", body)
          .then((res) => {
            console.log(res.data);
            if (res.data.success) {
              getBase64(file, (result) => {
                //console.log("result: ", result);
                file = result;
                //파일의 고유 정보와 구분을 위해 해시를 추가 함 기존은 url 로 구분 되어 블록체인에 등록되지 않는 경우 발생
                const hash = Crypto.createHash("sha256")
                  .update(file)
                  .digest("base64");
                // this.setState({
                //   new_token: hash,
                // });
                console.log("hash: ", hash);
                console.log("selectedData: ", selectedData);
                console.log("address: ", selectedData.address);
                // this.state.new_hash 를 파일 구분을 위해 추가 함
                contract.methods
                  .mint(
                    selectedData.filename,
                    selectedData.description,
                    selectedData.url,
                    selectedData.price,
                    hash
                  )
                  .send({ from: selectedData.address })
                  .once("receipt", (receipt) => {
                    console.log("nft receipt: ");
                    console.log(receipt);
                    alert("token is created");
                    this.props.history.push("/");
                  })
                  .catch((err) => {
                    console.log("catch ", err.message);
                    alert(err.message);
                  })
                  .finally(() => {
                    handleClose();
                  });
              });
            }
          })
          .catch((err) => {
            alert(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
      fullWidth
      maxWidth="md"
    >
      <DialogTitle id="responsive-dialog-title">
        {"상세 정보"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1} columns={18}>
          <Grid item xs={8} sm={6}>
            <Card
              sx={{
                maxHeight: 197,
                margin: "0.5rem",
                minHeight: 170,
                backgroundColor: "rgb(182, 182, 182)",
                overflow: "auto",
              }}
            >
              <img
                src={selectedData?.url}
                alt={selectedData?.url}
                className={styles.images}
              />
            </Card>
          </Grid>
          <Grid item xs={10} sm={12}>
            <Box sx={{ mt: 1, pr: 2 }}>
              <TextField
                id="email"
                label="Owner"
                defaultValue={selectedData.email}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                sx={{ m: 1 }}
                fullWidth
              />
              <TextField
                id="filename"
                label="File Name"
                defaultValue={selectedData.filename}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ m: 1 }}
                variant="standard"
                fullWidth
              />
              <TextField
                id="url"
                label="URL"
                defaultValue={selectedData.url}
                InputProps={{
                  readOnly: true,
                }}
                title={selectedData.url}
                sx={{ m: 1 }}
                variant="standard"
                fullWidth
              />
            </Box>
          </Grid>
          <Grid item xs={18} sm={18} sx={{ mt: 1, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="type"
                  label="Type"
                  defaultValue={selectedData.type}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="price"
                  label="Price"
                  defaultValue={selectedData.price}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="period"
                  label="Period"
                  defaultValue={selectedData.period}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="buyout"
                  label="Buyout"
                  defaultValue={selectedData.buyout}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="markup"
                  label="Markup"
                  defaultValue={selectedData.markup}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
              <Grid item xs={9} sm={6} sx={{ pr: 2 }}>
                <TextField
                  id="createdAt"
                  label="CreatedAt"
                  defaultValue={new Date(
                    selectedData.createdAt
                  ).toLocaleString()}
                  sx={{ m: 1 }}
                  InputProps={{
                    readOnly: true,
                  }}
                  variant="standard"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={18}>
            <TextField
              id="description"
              label="Description"
              multiline
              rows={2}
              defaultValue={selectedData.description}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleMintSubmit} autoFocus>
          MINT
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
