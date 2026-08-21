import axios from "axios";
import api from "./api";

const UrlUsuarios = api.urlAPI + "usuarios";

export const postUsuario = async (usuario, token) => {
  try {
    const response = await axios.post(UrlUsuarios, usuario, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getUsuarios = async (token) => {
  try {
    const response = await axios(UrlUsuarios, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putUsuario = async (usuario, id, token) => {
  try {
    const response = await axios.put(UrlUsuarios + "/" + id, usuario, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const setRolesUsuario = async (id, rolIds, token) => {
  try {
    const response = await axios.put(
      UrlUsuarios + "/" + id + "/roles",
      { rolIds },
      {
        headers: {
          "cs-token": token,
        },
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};
