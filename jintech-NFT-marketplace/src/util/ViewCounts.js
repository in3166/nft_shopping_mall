import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authCheckAction } from "../store/actions/user-action";
import { userAction } from "../store/reducers/user-slice";

// option: 1-loggedin / 0-not loggedin
const ViewCounts = async (url, email, data) => {
  const res = await axios.get("https://geolocation-db.com/json/");
  console.log(res.data);
  let ip = res.data.IPv4;
  console.log(ip);

  const existed = localStorage.getItem(ip + url);
  if (!!existed) return;

  localStorage.setItem(ip + url, true);

  const request = async () => {
    const body = {
      userEmail: email,
      client_url: url,
      client_ip: ip,
      ...data,
    };

    axios.post("/api/views", body).then((res) => {
      console.log("res: ", res);
    });
  };
  request();
};

export default ViewCounts;
