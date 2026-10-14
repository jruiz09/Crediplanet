import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import NavListDrawer from "./NavListDrawer";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Box } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { marca, urlSocket } from "../../config/marca";

// 📢 Alerta personalizada para Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Navbar({ navegationLinks, children }) {
  const [open, setOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");

  const navigate = useNavigate();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(urlSocket, {
        path: "/api/socket.io",
        transports: ["websocket"],
      });

      // Exponer en consola
      window.socket = socketRef.current;

      socketRef.current.on("connect", () => {
        console.log("🟢 Socket conectado:", socketRef.current.id);
      });

      socketRef.current.on("nuevaNotificacion", (data) => {
        console.log("📥 Notificación recibida:", data);
        setNotificaciones((prev) => [data, ...prev]);
        setMensajeSnackbar(
          `📢 Cliente ${data.cliente} pagó la cuota ${data.cuota} por ${data.monto}`
        );
        setOpenSnackbar(true);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.warn("🔌 Socket desconectado:", reason);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("❌ Error de conexión socket:", err.message);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔴 Socket desconectado");
      }
    };
  }, []);

  const handleOpenNotif = (event) => {
    setAnchorNotif(event.currentTarget);
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const handleCloseNotif = () => setAnchorNotif(null);

  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const menu = () => navigate("/");
  const cantidadNoLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "var(--color-primario-oscuro)", color: "background.default" }}>
        <Toolbar>
          <IconButton color="inherit" size="large" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>

          <IconButton color="inherit" size="large" onClick={menu}>
            <HomeIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {marca.nombre} | V 3.0.0
          </Typography>

          <IconButton color="inherit" onClick={handleOpenNotif}>
            <Badge badgeContent={cantidadNoLeidas} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu anchorEl={anchorNotif} open={Boolean(anchorNotif)} onClose={handleCloseNotif}>
            {notificaciones.length === 0 ? (
              <MenuItem disabled>
                <ListItemText primary="Sin notificaciones" />
              </MenuItem>
            ) : (
              notificaciones.map((n, i) => (
                <MenuItem
                  key={i}
                  onClick={handleCloseNotif}
                  sx={{ backgroundColor: !n.leida ? "#f0f0f0" : "inherit" }}
                >
                  <ListItemText
                    primary={`Cliente: ${n.cliente} | Cuota ${n.cuota} | Tipo ${n.tipo}`}
                    secondary={`Crédito #${n.idcredito} - Cobrador: ${n.cobrador}`}
                  />
                </MenuItem>
              ))
            )}
          </Menu>

          <Box sx={{ display: { xs: "end", sm: "block" } }}>
            <Button color="inherit" onClick={logout}>
              <ExitToAppIcon />
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {children}

      <Drawer open={open} anchor="left" onClose={() => setOpen(false)}>
        <NavListDrawer navegationLinks={navegationLinks} component={Link} setOpen={setOpen} />
      </Drawer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info">
          {mensajeSnackbar}
        </Alert>
      </Snackbar>
    </>
  );
}

