import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

export default function Modals({ modalabrir, titulo, contenido, botones }) {
  return (
    <>
    <Dialog
        open={modalabrir}       
        fullWidth
        maxWidth="lg"
      >
  
      <DialogContent dividers>
      <Box >
          <Typography
                variant="h6"
            color="white"
            align="center"
            pb={1}
            mb={2}
            style={{
              backgroundColor: "#922b3e",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            {titulo}
          </Typography>
          <Box align="center">{contenido}</Box>

          <Box align="center">{botones}</Box>
        </Box>
        </DialogContent>

        </Dialog>
    </>
  );
}
