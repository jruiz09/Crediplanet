// Configuración por negocio. Se elige con VITE_MARCA (ver .env.<marca>).
// Los tonos alimentan la paleta "marca" de Tailwind (bg-marca-600, text-marca-700...).
const MARCAS = {
  crediplanet: {
    nombre: "CrediPlanet Mobile",
    tonos: {
      50: "#eff6ff",
      100: "#dbeafe",
      300: "#93c5fd",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
    },
  },
  mym: {
    nombre: "M&M Mobile",
    tonos: {
      50: "#fff7ed",
      100: "#ffedd5",
      300: "#fdba74",
      500: "#ea580c",
      600: "#c2410c",
      700: "#9a3412",
      800: "#7c2d12",
    },
  },
};

export const TONOS = [50, 100, 300, 500, 600, 700, 800];

export const marca = MARCAS[import.meta.env.VITE_MARCA] ?? MARCAS.crediplanet;

export const urlAPI =
  import.meta.env.VITE_API_URL ?? "https://app.cplanet.com.ar/api/api/";

export const aplicarMarca = () => {
  TONOS.forEach((tono) =>
    document.documentElement.style.setProperty(`--marca-${tono}`, marca.tonos[tono])
  );
  document.title = marca.nombre;
};
