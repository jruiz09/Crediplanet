import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import NavListDrawer from "./NavListDrawer";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Box } from "@mui/system";
import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Menu, MenuItem, ListItemText } from "@mui/material";
import { useEffect } from "react";
import api from "../utils/api"

export default function Navbar({ navegationLinks, children }) {
  const [open, setOpen] = useState(false);

  const [rol, setRol] = useState(localStorage.getItem("rol"));
  const [usuario, setUsuario] = useState(localStorage.getItem("usuario"));
  const [empresa, setEmpresa] = useState(localStorage.getItem("empresa"));
  const [notificaciones, setNotificaciones] = useState([]);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const apiNotificaciones = api.urlAPI + "notificaciones"

  const handleOpenNotif = (event) => setAnchorNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorNotif(null);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const menu = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await fetch(apiNotificaciones);
        const data = await res.json();
        setNotificaciones(data);
      } catch (err) {
        console.error("Error al obtener notificaciones:", err);
      }
    };

    fetchNotificaciones();
    const interval = setInterval(fetchNotificaciones, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#8C012B", color: "background.default" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            size="large"
            onClick={() => setOpen(true)}
            /*sx={{ display: { xs: "flex", sm: "none" } }}*/
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <IconButton color="inherit" size="large" onClick={() => menu()}>
            <HomeIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Credi-Planet | V 1.0.0
          </Typography>
          <IconButton color="inherit" onClick={handleOpenNotif}>
            <Badge badgeContent={notificaciones.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorNotif}
            open={Boolean(anchorNotif)}
            onClose={handleCloseNotif}
          >
            {notificaciones.length === 0 ? (
              <MenuItem disabled>
                <ListItemText primary="Sin notificaciones" />
              </MenuItem>
            ) : (
              notificaciones.map((n, i) => (
                <MenuItem key={i} onClick={handleCloseNotif}>
                  <ListItemText
                    primary={`Cliente: ${n.cliente} | Cuota ${n.cuota}`}
                    secondary={`Crédito #${n.idcredito} - Cobrador: ${n.cobrador}`}
                  />
                </MenuItem>
              ))
            )}
          </Menu>

          <Box sx={{ display: { xs: "end", sm: "block" } }}>
            <Button color="inherit" onClick={() => logout()}>
              <ExitToAppIcon />
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {children}

      <Drawer
        open={open}
        anchor="left"
        onClose={() => setOpen(false)}
        /*   sx={{ display: { xs: "flex", sm: "none" } }}*/
      >
        <NavListDrawer
          navegationLinks={navegationLinks}
          component={Link}
          setOpen={setOpen}
        />
      </Drawer>
    </>
  );
}
