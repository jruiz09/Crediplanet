// Configuración por negocio. Se elige con VITE_MARCA (ver .env.<marca>).
const MARCAS = {
  crediplanet: {
    nombre: "Credi-Planet",
    colores: {
      primario: "#922b3e",
      primarioOscuro: "#8c012b",
      primarioClaro: "#d87d8e",
      acento: "#a11c55",
      suave: "#c5899a",
    },
  },
  mym: {
    nombre: "MyM",
    colores: {
      primario: "#c2410c",
      primarioOscuro: "#7c2d12",
      primarioClaro: "#fdba74",
      acento: "#ea580c",
      suave: "#fed7aa",
    },
  },
};

export const marca = MARCAS[import.meta.env.VITE_MARCA] ?? MARCAS.crediplanet;

export const urlAPI =
  import.meta.env.VITE_API_URL ?? "https://app.cplanet.com.ar/api/api/";

// "https://app.cplanet.com.ar/api/api/" -> "https://app.cplanet.com.ar"
export const urlSocket = new URL(urlAPI).origin;

// Por defecto "https://app.cplanet.com.ar/api/api/" -> "https://app.cplanet.com.ar/api/uploads/"
export const urlUploads =
  import.meta.env.VITE_UPLOADS_URL ?? urlAPI.replace(/api\/$/, "") + "uploads/";

const VARIABLES_CSS = {
  primario: "--color-primario",
  primarioOscuro: "--color-primario-oscuro",
  primarioClaro: "--color-primario-claro",
  acento: "--color-acento",
  suave: "--color-suave",
};

export const aplicarMarca = () => {
  Object.entries(VARIABLES_CSS).forEach(([clave, variable]) =>
    document.documentElement.style.setProperty(variable, marca.colores[clave])
  );
  document.title = marca.nombre;
};
