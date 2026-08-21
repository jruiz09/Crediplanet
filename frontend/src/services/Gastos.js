import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlGastos = api.urlAPI + "gasto";
const loginAPI = api.urlAPI + "auth/cambiarcontrase";
console.log("headers", Headers);

export const getGastos = async (token) => {
  try {
    const response = await axios(UrlGastos, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};


export const getGastosResumen = async (token) => {
  try {
    const response = await axios(UrlGastos+"resumen", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const postGastos = async (gasto,token) => {
  try {
    const response = await axios.post(UrlGastos, gasto, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const postContraseña = async (gasto,token) => {
  try {
    const response = await axios.post(loginAPI, gasto, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putGastos = async (gasto, idgasto, token) => {
  try {
    const response = await axios.put(UrlGastos + "/" + idgasto, gasto, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteGastos = async (idgasto, token) => {
  try {
    const response = await axios.delete(UrlGastos + "/" + idgasto, {
      headers: {
        "cs-token": token ,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
