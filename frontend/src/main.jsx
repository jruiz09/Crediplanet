
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline } from '@mui/material'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import UserProvider from "./context/UserProvider"
import Auth from './Auth/Auth.jsx'
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Login from './pages/Login';
import Clientes from "./pages/Clientes";
import Cobradores from "./pages/Cobradores";
import Planes from "./pages/Planes";
import Creditos from "./pages/Creditos";
import CreditosDetalle from "./pages/CreditosDetalle";
import Caja from "./pages/Caja";
import Rendicion from "./pages/Rendicion";
import Productividad from "./pages/Productividad";
import Vale from "./pages/Vale";
import ProductividadFechas from "./pages/ProductividadFechas";
import PagoCobradores from "./pages/PagoCobradores"
import NoLaborales from "./pages/NoLaborales";
import ClientesMorosos from "./pages/ClientesMorosos"
import Informes from "./pages/Informes";
import Gastos from "./pages/Gastos";
import CambiarContraseña from "./pages/CambiarContraseña";
import ResumenCliente from "./pages/ResumenCliente.jsx";
import NotificacionesAdmin from "./pages/NotificacionesAdmin.jsx";
import RutaProtegida from "./components/utils/RutaProtegida.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

      <CssBaseline />
      <BrowserRouter basename={"/"}>
      <UserProvider>
      <Routes>
        <Route path="/Auth" element={<Auth />}>
          <Route path="Login" element={<Login />} />
        </Route>
        <Route path="/" element={<App />}>
          <Route
            path=""
            element={
                <Home />
            }
          />

        <Route path='/Clientes' element={<RutaProtegida codigo="CLIENTES"><Clientes /></RutaProtegida>} />
        <Route path='/Cobradores' element={<RutaProtegida codigo="COBRADORES"><Cobradores /></RutaProtegida>} />
        <Route path='/Planes' element={<RutaProtegida codigo="PLANES"><Planes /></RutaProtegida>} />
        <Route path='/Creditos' element={<RutaProtegida codigo="CREDITOS"><Creditos /></RutaProtegida>} />
        <Route path='/CreditosDetalle' element={<RutaProtegida codigo="CREDITOS"><CreditosDetalle /></RutaProtegida>} />
        <Route path='/Caja' element={<RutaProtegida codigo="CAJA"><Caja /></RutaProtegida>} />
        <Route path='/Rendicion' element={<RutaProtegida codigo="RENDICION"><Rendicion /></RutaProtegida>} />
        <Route path='/Productividad' element={<RutaProtegida codigo="PRODUCTIVIDAD"><Productividad /></RutaProtegida>} />
        <Route path='/ProductividadFechas' element={<RutaProtegida codigo="PRODUCTIVIDAD_FECHAS"><ProductividadFechas /></RutaProtegida>} />
        <Route path='/PagoCobradores' element={<RutaProtegida codigo="PAGO_COBRADORES"><PagoCobradores /></RutaProtegida>} />
        <Route path='/Vale' element={<Vale />} />
        <Route path='/NoLaborales' element={<RutaProtegida codigo="NO_LABORALES"><NoLaborales /></RutaProtegida>} />
        <Route path='/ClientesMorosos' element={<RutaProtegida codigo="CLIENTES_MOROSOS"><ClientesMorosos /></RutaProtegida>} />
        <Route path='/Informes' element={<RutaProtegida codigo="INFORMES"><Informes /></RutaProtegida>} />
        <Route path='/Gastos' element={<RutaProtegida codigo="GASTOS"><Gastos /></RutaProtegida>} />
        <Route path='/ResumenCliente' element={<RutaProtegida codigo="RESUMEN_CLIENTE"><ResumenCliente /></RutaProtegida>} />
        <Route path='/CambiarContraseña' element={<CambiarContraseña />} />
        <Route path='/Notificaciones' element={<RutaProtegida codigo="NOTIFICACIONES"><NotificacionesAdmin /></RutaProtegida>} />
        </Route>
        <Route path='*' element={<NotFound />} />

      </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
)
