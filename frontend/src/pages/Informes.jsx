
import { Box, Button, FormControl, Grid, MenuItem, Select, Typography } from '@mui/material';
import React, { useState } from 'react'
import BoxGeneral from '../components/utils/BoxGeneral'
import SearchIcon from "@mui/icons-material/Search";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InformeCreditos from './InformeCreditos';
import InformeCreditosSemanal from './InformeCreditosSemanal';
import InformeGastos from './InformeGastos';


const Informes = () => {
    const [tipo, setTipo] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    
  const [user, setUser] = useState(localStorage.getItem("usuario"));

    
  const styleBox = {
    p: 4,
    marginLeft: "20px",
    marginRight: "20px",
    marginBottom: "40px",
    marginTop: "20px",
    alignItems: "center",
    boxShadow: 5,
  };
  return (<>
  {
    user == "crediplanet" ? (<>
    <Typography
          variant= "h4"
          fon
          pb={1}
          mb={2}
          style={{
            padding: "10px",
            borderRadius: "10px",
          }}
        >   No tiene permisos en esta pantalla
        </Typography>
 </>)
    :
  (<Box>
    <InformeCreditosSemanal/>
            <InformeCreditos/>
            <InformeGastos/>
           
      
        </Box>)
  }
    

    
        </>
  )
}

export default Informes
