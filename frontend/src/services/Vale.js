import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlVale = api.urlAPI + "vale";
console.log("headers", Headers);

export const getVales = async (token) => {
  try {
    const response = await axios(UrlVale, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const postVales = async (Post, token) => {
  try {
    const response = await axios.post(UrlVale, Post, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putVales = async (vale, idvale, token) => {
  try {
    const response = await axios.put(UrlVale + "/" + idvale, vale, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteVale = async (idvale, token) => {
  try {
    console.log(UrlVale + "/" + idvale)
    const response = await axios.delete(UrlVale + "/" + idvale, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
