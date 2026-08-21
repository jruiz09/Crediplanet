import { Outlet, useNavigate} from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import Navbar from './components/Navbar/Navbar';
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/UserProvider";
import BuildIcon from '@mui/icons-material/Build';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import PaidIcon from '@mui/icons-material/Paid';
import CalculateIcon from '@mui/icons-material/Calculate';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddchartIcon from '@mui/icons-material/Addchart';
import PasswordIcon from '@mui/icons-material/Password';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import GroupIcon from '@mui/icons-material/Group';

export const navegationLinks = [
  {
    title: "Home",
    path: "/Home",
    icon: <HomeIcon />,
    codigo: "HOME"
  },
  {
    title: "Clientes",
    path: "/Clientes",
    icon: <PermIdentityIcon/>,
    codigo: "CLIENTES"
  },
  {
    title: "Cobradores",
    path: "/Cobradores",
    icon: <TransferWithinAStationIcon/>,
    codigo: "COBRADORES"
  },
  {
    title: "Planes",
    path: "/Planes",
    icon: <BuildIcon/>,
    codigo: "PLANES"
  }
  ,
  {
    title: "Creditos",
    path: "/Creditos",
    icon: <AttachMoneyIcon/>,
    codigo: "CREDITOS"
  }
  ,
  {
    title: "Caja",
    path: "/Caja",
    icon: <AccountBalanceIcon/>,
    codigo: "CAJA"
  }  ,
  {
    title: "Rendición",
    path: "/Rendicion",
    icon: <PaidIcon/>,
    codigo: "RENDICION"
  }
  ,
  {
    title: "Productividad",
    path: "/Productividad",
    icon: <CalculateIcon/>,
    codigo: "PRODUCTIVIDAD"
  }
  ,
  {
    title: "ProductividadFechas",
    path: "/ProductividadFechas",
    icon: <CalculateIcon/>,
    codigo: "PRODUCTIVIDAD_FECHAS"
  },
  {
    title: "PagoCobradores",
    path: "/PagoCobradores",
    icon: <RequestQuoteIcon/>,
    codigo: "PAGO_COBRADORES"
  }
  ,
  {
    title: "No Laborales",
    path: "/NoLaborales",
    icon: <CalendarMonthIcon/>,
    codigo: "NO_LABORALES"
  }
  ,
  {
    title: "Clientes Morosos",
    path: "/ClientesMorosos",
    icon: <MoneyOffIcon/>,
    codigo: "CLIENTES_MOROSOS"
  }  ,
  {
    title: "Informes",
    path: "/Informes",
    icon: <DashboardIcon/>,
    codigo: "INFORMES"
  }
  ,
  {
    title: "Gastos",
    path: "/Gastos",
    icon: <AddchartIcon/>,
    codigo: "GASTOS"
  }
  ,

  {
    title: "Resumen Clientes",
    path: "/ResumenCliente",
    icon: <PermIdentityIcon/>,
    codigo: "RESUMEN_CLIENTE"
  },

  {
    title: "Notificaciones Cobradores",
    path: "/Notificaciones",
    icon: <DashboardIcon/>,
    codigo: "NOTIFICACIONES"
  }
  ,
  {
    title: "Roles",
    path: "/Roles",
    icon: <AdminPanelSettingsIcon/>,
    codigo: "ROLES"
  }
  ,
  {
    title: "Pantallas",
    path: "/Pantallas",
    icon: <DisplaySettingsIcon/>,
    codigo: "PANTALLAS"
  }
  ,
  {
    title: "Usuarios",
    path: "/Usuarios",
    icon: <GroupIcon/>,
    codigo: "USUARIOS"
  }
  ,
  {
    title: "Cambiar Contraseña",
    path: "/CambiarContraseña",
    icon: <PasswordIcon/>
  }

]

function App() {
  const navigate = useNavigate();
  const { tienePermisoPantalla } = useContext(UserContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const linksPermitidos = navegationLinks.filter((link) => tienePermisoPantalla(link.codigo));

    const checkUserToken = () => {
        const userToken = localStorage.getItem('user-token');
        console.log("UserToken: ", userToken)
        if (!userToken || userToken === 'undefined') {    
            setIsLoggedIn(false);
            return navigate('/auth/login');
            console.log("IsLogged: ", isLoggedIn)
        }
        else
        {setIsLoggedIn(true);}
        
    }


	
  return (
    <>

<React.Fragment>
			 <Navbar navegationLinks={linksPermitidos} children= {<Outlet/>}>
       
        </Navbar>
        
           
		</React.Fragment>
  </>
  );
}

export default App
