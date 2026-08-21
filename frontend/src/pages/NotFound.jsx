import { Link } from "react-router-dom"
import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

const NotFound = () => {
    return (
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: "#1e88e5",
        }}
      >
        <Typography variant="h1" style={{ color: 'white' }}>
          404
        </Typography>
        <Typography variant="h6" style={{ color: 'white' }}>
          La ruta donde se dirige no existe.
        </Typography>
        <Link to="/"> <Button variant="contained">Regresar</Button></Link>
      </Box>
       

        )

}


export default NotFound;