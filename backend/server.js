const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configurar Socket.IO con path personalizado, CORS y compatibilidad
const io = new Server(server, {
  path: "/api/socket.io",
  cors: {
    origin: "https://app.cplanet.com.ar",
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true, // Compatibilidad con versiones anteriores del cliente
});

// Guardar instancia de socket en express app
app.set("io", io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "creditsystem-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true,
    sameSite: "strict",
  })
);

// Archivos estáticos (ej: imágenes de uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Base de datos
const db = require("./models");
const Role = db.role;
db.sequelize.sync();

// Rutas
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/empresa.routes")(app);
require("./routes/cobrador.routes")(app);
require("./routes/cliente.routes")(app);
require("./routes/plan.routes")(app);
require("./routes/credito.routes")(app);
require("./routes/creditodetalle.routes")(app);
require("./routes/caja.routes")(app);
require("./routes/vale.routes")(app);
require("./routes/rendicion.routes")(app);
require("./routes/pagocobradores.routes")(app);
require("./routes/nolaborales.routes")(app);
require("./routes/gasto.routes")(app);
require("./routes/notificacion.routes")(app);
require("./routes/pantalla.routes")(app);
require("./routes/rol.routes")(app);
require("./routes/permisos.routes")(app);

// Ruta simple para test
app.get("/", (req, res) => {
  res.json({ message: "Bienvenidos a crediplanet." });
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("✅ Cliente conectado por socket:", socket.id);

  // Escuchar notificaciones desde el cliente
  socket.on("nuevaNotificacion", (data) => {
    console.log("📬 Notificación recibida del cliente:", data);
    io.emit("nuevaNotificacion", data); // reenviar a todos los clientes conectados
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 Cliente desconectado:", socket.id, "Motivo:", reason);
  });

  socket.on("error", (err) => {
    console.error("❌ Socket error:", err);
  });
});

// Servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🚀 Servidor con Socket.IO corriendo en puerto ${PORT}`);
});

// Función para crear roles iniciales (solo si activás `force: true`)
function initial() {
  Role.create({ id: 1, name: "user" });
  Role.create({ id: 2, name: "supervisor" });
  Role.create({ id: 3, name: "admin" });
}
