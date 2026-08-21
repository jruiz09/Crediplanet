import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { Box } from '@mui/material';

export default function Deposits({texto, cantidad, color}) {
  return (
    <React.Fragment>
        <Box sx={{boxShadow: 2, p:2, align: "center", justifyContent: "center" }}>
      <Title sx={{ align: "center", justifyContent: "center"}}>{texto}</Title>
      <Typography sx={{ align: "center", justifyContent: "center" , color: {color}}} component="p" variant="h4">
        {cantidad}
      </Typography>
      </Box>
    </React.Fragment>
  );
}