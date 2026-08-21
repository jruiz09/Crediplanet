import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlCreditos = api.urlAPI + "credito";
console.log("headers", Headers);

export const getCreditos = async (token) => {
  try {
    const response = await axios(UrlCreditos , {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getRendicionProductividadActual = async (token) => {
  try {
    const response = await axios(UrlCreditos + "/rendicionproductividadactual", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getRendicionProductividadSemanal = async (token) => {
  try {
    const response = await axios(UrlCreditos + "/rendicionproductividadsemanal", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getResumenCreditos = async (token) => {
  try {
    const response = await axios(UrlCreditos + "/resumencreditos", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getResumenCreditosDetalles = async (token) => {
  try {
    const response = await axios(UrlCreditos + "/resumencreditosdetalles", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getResumenCreditosMensual = async (token) => {
  try {
    const response = await axios(UrlCreditos + "/resumenmensualcreditos", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getCreditosSemanales = async (token) => {
  try {
    const response = await axios(UrlCreditos + "/creditossemanales", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getCreditosSemanalesDetalles = async (token) => {
  try {
    const response = await axios(UrlCreditos + "/creditossemanalesdetalles", {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getRendicion = async (idcobrador, token) => {
  try {
    const response = await axios(UrlCreditos + "/rendicion/"+ idcobrador, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getResumen = async (idcredito, token) => {
  try {
    const response = await axios(UrlCreditos + "/resumen/"+ idcredito, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const getRendido = async (idcobrador, token) => {
  try {
    const response = await axios(UrlCreditos + "/rendido/"+ idcobrador, {
      headers: {
        "cs-token": token,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const postCreditos = async (Post, token) => {
  console.log("Post Creditos", Post)
    try {
      const response = await axios.post(UrlCreditos, Post, {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };



  export const deleteCreditos = async (IdCredito, token) => {
    try {
      const response = await axios.delete(UrlCreditos + "/" + IdCredito, {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };