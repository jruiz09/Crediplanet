// src/theme/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#880e4f", // Bordó
    },
  secondary: {
  main: "#f9f9f9", // nuevo color claro neutro
},

  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;
