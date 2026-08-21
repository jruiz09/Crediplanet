import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const Urlcobradores = api.urlAPI + "cobrador";
console.log("headers", Headers);

export const getCobradores = async (token) => {
  try {
    const response = await axios(Urlcobradores, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const postCobradores = async (cobrador,token) => {
  try {
    const response = await axios.post(Urlcobradores, cobrador, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putCobradores = async (cobrador, idcobrador, token) => {
  try {
    const response = await axios.put(Urlcobradores + "/" + idcobrador, cobrador, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteCobradores = async (idcobrador) => {
  try {
    const response = await axios.delete(Urlcobradores + "/" + idcobrador, {
      headers: {
        "cs-token": userToken,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
