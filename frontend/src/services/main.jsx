
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



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

      <CssBaseline />
      <BrowserRouter basename={"/"}>
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
                 
        <Route path='/Clientes' element={<Clientes />} />
        <Route path='/Cobradores' element={<Cobradores />} />
        <Route path='/Planes' element={<Planes />} />
        <Route path='/Creditos' element={<Creditos />} />
        <Route path='/CreditosDetalle' element={<CreditosDetalle />} />
        <Route path='/Caja' element={<Caja />} />
        <Route path='/Rendicion' element={<Rendicion />} />
        <Route path='/Productividad' element={<Productividad />} />
        <Route path='/ProductividadFechas' element={<ProductividadFechas />} />
        <Route path='/PagoCobradores' element={<PagoCobradores />} />
        <Route path='/Vale' element={<Vale />} />
        <Route path='/NoLaborales' element={<NoLaborales />} />
        <Route path='/ClientesMorosos' element={<ClientesMorosos />} />
        <Route path='/Informes' element={<Informes />} />
        <Route path='/Gastos' element={<Gastos />} />
        <Route path='/CambiarContraseña' element={<CambiarContraseña />} />
        </Route>
        <Route path='*' element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
