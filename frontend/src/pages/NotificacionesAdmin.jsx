import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import dayjs from "dayjs";
import MiniMapa from "./MiniMapa";
import api from "../components/utils/api"

export default function NotificacionesAdmin() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cliente, setCliente] = useState("");
  const [cobrador, setCobrador] = useState("");
  const [fecha, setFecha] = useState("");

const Notifaciones = api.urlAPI + "notificaciones";

  useEffect(() => {
    fetch(Notifaciones)
      .then((res) => res.json())
      .then((data) => {
        setNotificaciones(data);
        setFiltered(data);
      });
  }, []);

  const handleFilter = () => {
    const filtrado = notificaciones.filter((n) => {
      return (
        (!cliente || n.cliente.toLowerCase().includes(cliente.toLowerCase())) &&
        (!cobrador ||
          n.cobrador.toLowerCase().includes(cobrador.toLowerCase())) &&
        (!fecha || dayjs(n.createdAt).format("YYYY-MM-DD") === fecha)
      );
    });
    setFiltered(filtrado);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Panel de Notificaciones
      </Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Cliente"
            fullWidth
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Cobrador"
            fullWidth
            value={cobrador}
            onChange={(e) => setCobrador(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            type="date"
            label="Fecha de Alta"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ height: "100%" }}
            onClick={handleFilter}
          >
            Filtrar
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Cobrador</TableCell>
              <TableCell>Crédito</TableCell>
              <TableCell>Cuota</TableCell>
              <TableCell>MontoCuota</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Ubicación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.cliente}</TableCell>
                <TableCell>{row.cobrador}</TableCell>
                <TableCell>{row.idcredito}</TableCell>
                <TableCell>{row.cuota}</TableCell>
                <TableCell>{row.monto}</TableCell>
                <TableCell>
                  {dayjs(row.createdAt).format("YYYY-MM-DD HH:mm")}
                </TableCell>
                <TableCell>
                  {row.latitud && row.longitud ? (
                    <>
                      <a
                        href={`https://www.google.com/maps?q=${row.latitud},${row.longitud}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <RoomIcon color="primary" /> Ver mapa
                      </a>
                    </>
                  ) : (
                    "Sin ubicación"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
