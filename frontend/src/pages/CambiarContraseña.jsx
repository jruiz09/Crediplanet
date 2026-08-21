import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import api from "../components/utils/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-material-ui/material-ui.css";
import { postContraseña } from "../services/Gastos";

const CambiarContraseña = () => {
    const [token, setToken] = useState(localStorage.getItem("user-token"));
  const [user, setUser] = useState(localStorage.getItem("usuario"));
  const [contraseña, setContraseña] = useState("");
  const loginAPI = api.urlAPI + "auth/cambiarcontrase";
  const Post = {
    username: user,
    password: contraseña,
  };
  const navigate = useNavigate();

  const Confirmar = async () => {
    if ([Post.password].includes("")) {
      swal({
        title: "La contraseña debe tener caracteres",
        icon: "error",
        showConfirmButton: true,
      });
    } else {
      Swal.fire({
        title: "Deseas cambiar la contraseña?",
        showDenyButton: true,
        confirmButtonText: "Si, guardar",
        denyButtonText: `No, cancelar`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          EjecutaPost();
        } else if (result.isDenied) {
          Swal.fire("La operación fue cancelada", "", "info");
        }
      });
    }
  };

  const EjecutaPost = async () => {


    const gastosPost = await postContraseña(Post, token);
    if (gastosPost.status === 200) {
      console.log("Request:", Post);
      console.log("Respuesta:", gastosPost);
      Swal.fire(gastosPost.data.message, "", "success");
     
      localStorage.clear();
      navigate('/auth/login');
    } else {
      console.log("Error NO VA: ", gastosPost);
      Swal.fire("Error : " + gastosPost.response.data.message, "", "error");
    }
  };

  return (
    <>
      <BoxGeneral texto="Cambiar contraseña">
        <TextField
          sx={{ mt: 2 }}
          label="Ingrese nueva contraseña"
          variant="outlined"
          fullWidth
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <Button
          variant="contained"
          color="success"
          onClick={() => Confirmar()}
          sx={{ mt: 2 }}
        >
          Confirmar
        </Button>
      </BoxGeneral>
    </>
  );
};

export default CambiarContraseña;
