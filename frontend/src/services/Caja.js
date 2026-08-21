import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlCaja = api.urlAPI + "caja";


export const getAllCaja = async (token) => {
    try {
      const response = await axios(UrlCaja, {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };


  export const postCaja = async (Post, token) => {
    try {
      const response = await axios.post(UrlCaja, Post, {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };
  

  export const getCajaResumen = async (token) => {
    try {
      const response = await axios(UrlCaja + "resumen", {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };
