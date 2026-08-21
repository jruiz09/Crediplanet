import axios from "axios";
import api from "./api";

const UrlRoles = api.urlAPI + "roles";

export const getRoles = async (token) => {
  try {
    const response = await axios(UrlRoles, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const postRol = async (rol, token) => {
  try {
    const response = await axios.post(UrlRoles, rol, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putRol = async (rol, id, token) => {
  try {
    const response = await axios.put(UrlRoles + "/" + id, rol, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteRol = async (id, token) => {
  try {
    const response = await axios.delete(UrlRoles + "/" + id, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const setPantallasRol = async (id, pantallaIds, token) => {
  try {
    const response = await axios.put(
      UrlRoles + "/" + id + "/pantallas",
      { pantallaIds },
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
