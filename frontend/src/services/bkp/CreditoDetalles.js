import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlDetalles = api.urlAPI + "creditodetalle";
console.log("headers", Headers);


export const getAllDetalles = async (token) => {
    try {
      const response = await axios(UrlDetalles, {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };


  
export const getDetallexCredito = async (IdCredito, token) => {
    try {
      const response = await axios(UrlDetalles +"/"+ IdCredito, {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };


  export const putPagoCuota = async (Post, idDetalleCredito, token) => {
    try {
      const response = await axios.put(UrlDetalles+ "/pagocuota/" + idDetalleCredito, Post, {
        headers: {
          "cs-token": token,
        },
      });
      console.log("Token detalle", token)
      return response;
    } catch (error) {
      console.log("Token detalle", token)
      return error;
    }
  };

  export const deleteCuota = async (idCreditoDetalle, token) => {
    try {
      console.log(UrlDetalles + "/" + idCreditoDetalle)
      const response = await axios.delete(UrlDetalles + "/" + idCreditoDetalle, {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      return error;
    }
  };
  