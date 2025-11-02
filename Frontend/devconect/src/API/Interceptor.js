import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    console.log("req sent");
    console.log("URL", config.baseURL + config.url); //base url + signup url
    console.log("Method", config.method?.toUpperCase());

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Data", config.data);

    return config;
  },
  (error) => {
    console.log("Error while sending request", error.message);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log("Res recieved!");
    console.log("Status", response.status);
    console.log("Data", response.data);

    return response;
  },
  (error) => {
    console.log("Error while recieving response");

    if (error.response) {
      console.log("Status", error.response.status);
      console.log("Message", error.response.data.message || error.message);
      if (error.response.status === 400) {
        toast.error(error.response.data.message || "Something went wrong!");
      }
      if (error.response.status === 401) {
        toast.error(error.response.data.message || "User does not exists!");
        console.warn("Unauthorized! Maybe session expired or not loged in");
      } else if (error.response.status === 500) {
        console.log("Internal server error!");
      } else {
        console.log("Network error!", error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
