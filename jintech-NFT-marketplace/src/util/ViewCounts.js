import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { authCheckAction } from "../store/actions/user-action";
import { userAction } from "../store/reducers/user-slice";

// option: 1-loggedin / 0-not loggedin
const ViewCounts = (url, email, data) => {
  const existed = localStorage.getItem(email + url);
  if (!!existed) return;

  localStorage.setItem(email + url, true);

  const request = async () => {
    const body = {
      userEmail: email,
      client_url: url,
      ...data,
    };

    axios.post("/api/views", body).then((res) => {
      console.log("res: ", res);
    });
  };
  request();
};

export default ViewCounts;
