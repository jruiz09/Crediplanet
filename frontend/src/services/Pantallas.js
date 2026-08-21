import axios from "axios";
import api from "./api";

const UrlPantallas = api.urlAPI + "pantallas";

export const getPantallas = async (token) => {
  try {
    const response = await axios(UrlPantallas, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const postPantalla = async (pantalla, token) => {
  try {
    const response = await axios.post(UrlPantallas, pantalla, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putPantalla = async (pantalla, id, token) => {
  try {
    const response = await axios.put(UrlPantallas + "/" + id, pantalla, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deletePantalla = async (id, token) => {
  try {
    const response = await axios.delete(UrlPantallas + "/" + id, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
