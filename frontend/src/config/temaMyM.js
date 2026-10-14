// Tema de Material UI de M&M (venía en /opt/front/src/theme.js del servidor),
// con los colores de la marca en lugar de los fijos.
export const temaMyM = (colores) => ({
  palette: {
    mode: "light",
    primary: { main: colores.primario },
    secondary: { main: colores.acento },
    success: { main: "#22C55E" },
    error: { main: "#EF4444" },
    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { color: "#64748B" },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#F5F7FB" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0px 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
          padding: "8px 16px",
        },
        containedPrimary: {
          boxShadow: `0px 4px 14px ${colores.primario}66`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1E293B",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: "#F1F5F9" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, color: "#334155" },
        body: { color: "#475569" },
      },
    },
  },
});
