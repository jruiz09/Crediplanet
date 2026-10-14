import { Button } from '@mui/material'
import React from 'react'


const ButtonNuevo = ({Funcion, Texto}) => {
  return (
    <Button
    sx={{
      boxShadow: 4,
      borderRadius: 3,
      background: "white",
      color: "var(--color-primario)",
      "&:hover": {
        background: "#f1f1f1",
        cursor: "pointer",
        borderBottom: 5,
        borderBottomColor: "var(--color-primario)",
    
      },
    }}
    onClick={() => Funcion()}
  >
    {Texto}
  </Button>
  )
}

export default ButtonNuevo
