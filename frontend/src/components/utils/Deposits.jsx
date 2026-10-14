import * as React from "react";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import { Box, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
export default function Deposits({ texto, imagen, color, path, tooltip }) {
  return (
    <React.Fragment>
      
      <Tooltip arrow placement="left" title={tooltip}>
      <Box
   display="flex"
   justifyContent="center"
   alignItems="center"
        sx={{
          boxShadow: 4,
          p: 1,
          borderRadius: 3,
          background: "white",
          '&:hover': {
             background: "#f1f1f1",
             cursor: "pointer",
             borderBottom: 5,
             borderBottomColor: color,
          },
        }}

      >
        <Title 
                      justifyContent="center"
        sx={{ align: "center", justifyContent: "center" }}>
          {texto}
        </Title>
        <br></br>
        <Typography
           display="flex"    
           alignItems="center"
           justifyContent="center"
          sx={{ align: "center", justifyContent: "center", color: { color } }}
          component={Link}
          to={`/${path}`}
          variant="h4"
        >
          {imagen}
        </Typography>
      </Box>
      
      </Tooltip>
    </React.Fragment>
  );
}
