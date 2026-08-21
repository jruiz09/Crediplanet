import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlPlanes = api.urlAPI + "plan";
console.log("headers", Headers);

export const getPlanes = async (token) => {
  try {
    const response = await axios(UrlPlanes, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const postPlanes = async (plan, token) => {
  try {
    const response = await axios.post(UrlPlanes, plan, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putPlanes = async (plan, idplan, token) => {
  try {
    const response = await axios.put(UrlPlanes + "/" + idplan, plan, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deletePlanes = async (idplan, token) => {
  try {
    const response = await axios.delete(UrlPlanes + "/" + idplan, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
