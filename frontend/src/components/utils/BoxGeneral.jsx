import { Box, Typography } from "@mui/material";

export default function BoxGeneral({children, texto}) {
    const styleBox = {
        p: 2,
        marginLeft: "20px",
        marginRight: "20px",
        marginBottom: "20px",
        marginTop: "20px",
        alignItems: "center",
        boxShadow: 4,
        
      };
    return (
        <>
        <Box sx={styleBox}>
        <Typography
          variant= "h4"
          color = "var(--color-primario)"
          fon
          pb={1}
          mb={2}
          style={{
            color : "var(--color-primario)", 
            padding: "10px",
            borderRadius: "10px",
          }}
        >
            {texto}
        </Typography>
            {children}
        </Box>
        </>
    )
}