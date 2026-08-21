import { useEffect, useState } from "react"
import { createContext } from "react"
import api from "../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getMenuPermitido } from "../services/Permisos";

const APP = "adm";

export const UserContext = createContext()

export default function UserProvider({children}) {

    const navigate = useNavigate();
    const userToken = localStorage.getItem("user-token");
    const UrlTest = api.urlAPI + "test/all";

  const [loading, setLoading] = useState(true);
  const [pantallasPermitidas, setPantallasPermitidas] = useState(new Set());
  const [permisosCargados, setPermisosCargados] = useState(false);

    console.log("ROL =>", localStorage.getItem("rol"))
    console.log("UserName =>", localStorage.getItem("usuario"))
    

    const [user, setUser] = useState(localStorage.getItem("usuario"))
    const [rol, setRol] = useState(localStorage.getItem("rol"))
    const [token, setToken] = useState(localStorage.getItem("user-token"))


    const iniciarSession = (data) => {
        window.localStorage.setItem("usuario",JSON.stringify(data))
        setUser(JSON.stringify(data))
        window.localStorage.setItem("rol",JSON.stringify(data))
        setRol(JSON.stringify(data))
    
    }

    const cerrarSession = () => {
        window.localStorage.removeItem("usuario")
        setUser(null)
        setPantallasPermitidas(new Set())
        setPermisosCargados(false)
    }

    const tienePermisoPantalla = (codigoPantalla) => {
        if (!codigoPantalla) return true;
        return pantallasPermitidas.has(codigoPantalla);
    }

    useEffect(() => {
        const fetchPermisos = async () => {
            const currentToken = localStorage.getItem("user-token");
            if (!currentToken) {
                setPantallasPermitidas(new Set());
                setPermisosCargados(true);
                return;
            }
            try {
                const response = await getMenuPermitido(APP, currentToken);
                const codigos = Array.isArray(response.data) ? response.data.map((p) => p.codigo) : [];
                setPantallasPermitidas(new Set(codigos));
            } catch (error) {
                console.error("Error cargando permisos", error);
                setPantallasPermitidas(new Set());
            } finally {
                setPermisosCargados(true);
            }
        };
        fetchPermisos();
    }, [user]);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await axios.get(UrlTest, {
                headers: {
                  "cs-token": userToken,
                },
              });
              console.log("Respuesta", response)
           if(response.message === "Unauthorized!")
           {
            localStorage.clear()
            console.log("BorroTodo")
           }
          } catch (error) {
            console.error("ERRORRRR: " , error.response.data.message);
            if(error.response.data.message === "Unauthorized!" || error.response.data.message === "No token provided!" )
            {
                localStorage.clear();
                navigate('/auth/login');
            }
          } finally {
            setLoading(false);
          }
        };
        fetchUser();
    }, []);


    return(
        <UserContext.Provider value={{ user, rol, iniciarSession, cerrarSession, pantallasPermitidas, permisosCargados, tienePermisoPantalla}}>
        {children}
        </UserContext.Provider>
    ) 
}