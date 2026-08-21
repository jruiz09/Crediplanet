import { Fab } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function WhatsappButton() {
  return (
    <Fab
      color="success"
      sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 999 }}
      href="https://wa.me/5491133344455"
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsAppIcon />
    </Fab>
  );
}
