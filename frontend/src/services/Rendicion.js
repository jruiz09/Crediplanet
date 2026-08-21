import axios from "axios";
import api from "./api";

const userToken = localStorage.getItem("user-token");
const UrlRendicion = api.urlAPI + "rendicion";


export const getRendicionDiaria = async (post, token) => {
    try {
      console.log("Post API" , post)
      const response = await axios.post(UrlRendicion +"/rendiciondiaria", post, {
        headers: {
          "cs-token": token,
        },
      });
      return response;
    } catch (error) {
      console.log(error)
      return error;
    }
  };


  export const getRendicionSemanal = async (post, token) => {
    try {
      const response = await axios.post(UrlRendicion +"/rendicionsemanal", post, {
        headers: {
          "cs-token": token,
        },
      });
      return response.json();
    } catch (error) {
      return error;
    }
  };

  export const getRendicionPorCorador = async (post, token) => {
    try {
      const response = await axios.post(UrlRendicion +"/rendicionporcobrador", post, {
        
        headers: {
          "cs-token": token,
        },
      });
      console.log("Respuesta", response)
      return response;
    } catch (error) {
      return error;
    }
  };

    export const getRendicionPorCoradorDetalles = async (post, token) => {
    try {
      const response = await axios.post(UrlRendicion +"/rendicionporcobradordetalle", post, {
        
        headers: {
          "cs-token": token,
        },
      });
      console.log("Respuesta", response)
      return response;
    } catch (error) {
      return error;
    }
  };


  