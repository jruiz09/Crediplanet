import axios from "axios";
import api from "./api";

const UrlPermisos = api.urlAPI + "permisos";

export const getMenuPermitido = async (app, token) => {
  try {
    const response = await axios.get(UrlPermisos + "/menu", {
      params: { app },
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const checkPermiso = async (codigoPantalla, app, token) => {
  try {
    const response = await axios.get(UrlPermisos + "/check", {
      params: { codigoPantalla, app },
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
