import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlPagoCobradores = api.urlAPI + "pagocobradores";

export const getPagoCobradores = async (token) => {
  try {
    const response = await axios(UrlPagoCobradores, {
      headers: {
        "cs-token": token,
      },
    });
    console.log("Respuesta, ", response)
    return response;
  } catch (error) {
    return error;
  }
};

export const postPagoCobradores = async (post, token) => {
  try {
    const response = await axios.post(UrlPagoCobradores, post, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};