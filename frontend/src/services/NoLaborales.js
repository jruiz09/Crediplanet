import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const Urlnolaborales = api.urlAPI + "nolaborales";
console.log("headers", Headers);

export const getNolaborales = async (token) => {
  try {
    const response = await axios(Urlnolaborales, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};


export const postNolaborales = async (Post, token) => {
  try {
    const response = await axios.post(Urlnolaborales, Post, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putNolaborales = async (post, idDia, token) => {
  try {
    const response = await axios.put(Urlnolaborales + "/" + idDia, post, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deletenolaborales = async (idDia, token) => {
  try {
    console.log(Urlnolaborales + "/" + idDia)
    const response = await axios.delete(Urlnolaborales + "/" + idDia, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
