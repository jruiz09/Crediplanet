import { Box, Typography } from '@mui/material'
import React from 'react'

const CajasInforme = ({ title, value }) => {
  return (
    <Box sx={{ width: '200px', height: '120px', boxShadow: 1, p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">
        {value}
      </Typography>
    </Box>
  )
}

export default CajasInforme