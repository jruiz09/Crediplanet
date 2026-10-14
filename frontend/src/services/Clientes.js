import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlClientes = api.urlAPI + "cliente";
console.log("headers", Headers);

export const getClientes = async (token) => {
  try {
    const response = await axios(UrlClientes, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getClientesMorosos = async (token) => {
  try {
    const response = await axios(UrlClientes + "smorosos", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getResumenClienteUltimosCreditosDetalles = async (idCliente,token) => {
  try {
    const response = await axios(UrlClientes + "/resumenclienteultimoscreditosdetalles/" +idCliente, {
      headers: {
        "cs-token": token,
      },
    });
    console.log ("reponse", response)
    return response;
  } catch (error) {
    return error;
  }
};

export const getResumenClienteUltimosCreditos = async (idCliente,token) => {
  try {
    const response = await axios(UrlClientes + "/resumenclienteultimoscreditos/" +idCliente, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};


export const getResumenClienteEstado = async (idCliente,token) => {
  try {
    const response = await axios(UrlClientes + "/resumenclienteestado/" +idCliente, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getRefinanciados = async (idCliente,token) => {
  try {
    const response = await axios(UrlClientes + "/refinanciado/" +idCliente, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getCreditosRefinanciados = async (idCliente,token) => {
  try {
    const response = await axios(UrlClientes + "/creditosrefinanciados/" +idCliente, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

/*
export const postClientes = async (Post, token) => {
  try {
    const response = await axios.post(UrlClientes, Post, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};*/

export const postClientes = async (formData, token) => {
  try {
    const response = await axios.post(UrlClientes, formData, {
      headers: {
        "cs-token": token,
        "Content-Type": "multipart/form-data"
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const putClientes = async (cliente, idCliente, token) => {
  try {
    const response = await axios.put(UrlClientes + "/" + idCliente, cliente, {
      headers: {
        "cs-token": token,
        "Content-Type": "multipart/form-data", // importante para FormData
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteClientes = async (idCliente, token) => {
  try {
    console.log(UrlClientes + "/" + idCliente)
    const response = await axios.delete(UrlClientes + "/" + idCliente, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};
