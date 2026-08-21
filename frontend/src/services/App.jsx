import { Outlet, useNavigate} from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import Navbar from './components/Navbar/Navbar';
import React, { useEffect, useState } from "react";
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

const navegationLinks = [
  {
    title: "Home",
    path: "/",
    icon: <HomeIcon />,
  },
  {
    title: "Clientes",
    path: "/Clientes",
    icon: <PermIdentityIcon/>
  },
  {
    title: "Cobradores",
    path: "/Cobradores",
    icon: <TransferWithinAStationIcon/>
  },
  {
    title: "Planes",
    path: "/Planes",
    icon: <BuildIcon/>
  }
  ,
  {
    title: "Creditos",
    path: "/Creditos",
    icon: <AttachMoneyIcon/>
  }
  ,
  {
    title: "Caja",
    path: "/Caja",
    icon: <AccountBalanceIcon/>
  }  ,
  {
    title: "Rendición",
    path: "/Rendicion",
    icon: <PaidIcon/>
  }
  ,
  {
    title: "Productividad",
    path: "/Productividad",
    icon: <CalculateIcon/>
  }
  ,
  {
    title: "ProductividadFechas",
    path: "/ProductividadFechas",
    icon: <CalculateIcon/>
  },
  {
    title: "PagoCobradores",
    path: "/PagoCobradores",
    icon: <RequestQuoteIcon/>
  }
  ,
  {
    title: "No Laborales",
    path: "/NoLaborales",
    icon: <CalendarMonthIcon/>
  }
  ,
  {
    title: "Clientes Morosos",
    path: "/ClientesMorosos",
    icon: <MoneyOffIcon/>
  }  ,
  {
    title: "Informes",
    path: "/Informes",
    icon: <DashboardIcon/>
  }
  ,
  {
    title: "Gastos",
    path: "/Gastos",
    icon: <AddchartIcon/>
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
			 <Navbar navegationLinks={navegationLinks} children= {<Outlet/>}>
       
        </Navbar>
        
           
		</React.Fragment>
  </>
  );
}

export default App
