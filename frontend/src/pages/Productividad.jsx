import { Box, Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import React, { useMemo, useState } from "react";
import BoxGeneral from "../components/utils/BoxGeneral";
import SearchIcon from "@mui/icons-material/Search";
import { getRendicionProductividadActual, getRendicionProductividadSemanal } from "../services/Creditos";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { MaterialReactTable } from "material-react-table";

const Productividad = () => {
  const [token, setToken] = useState(localStorage.getItem("user-token"));
    const [tipo, setTipo] = useState("")

    const [productividad, setProductividad] = useState([]);


    const fetchProductividadActual = async () => {
        const productividadData = await getRendicionProductividadActual(token);
        if (productividadData.status === 200) {
            setProductividad(productividadData.data);
        } else {
          console.log("Error: ", productividadData.response.data.message);
        }
      };

      const fetchProductividadSemana = async () => {
        const productividadData = await getRendicionProductividadSemanal(token);
        if (productividadData.status === 200) {
            setProductividad(productividadData.data);
        } else {
          console.log("Error: ", productividadData.response.data.message);
        }
      };

    const BuscarProductvidad = async  () => {
        if ([tipo].includes(""))
        {
            Swal.fire({
                icon: "error",
                title: "Debe seleccionar un rango",
              });
        }
        else if (tipo === "actual")
        {
            await fetchProductividadActual(token)
        }
        else
        {
            await fetchProductividadSemana(token)
        }

    }
    const columns = useMemo(
        () => [
           
          {
            accessorKey: "cobrador",
            header: "Cobrador",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "var(--color-primario)", color: "white" },
            },
          },
          
          {
            accessorKey: "Estimado", //normal accessorKey
            header: "Estimado",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "var(--color-primario)", color: "white" },
            },
          },
          {
            accessorKey: "Real",
            header: "real",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "var(--color-primario)", color: "white" },
            },
          },
          {
            accessorKey: "Productividad",
            header: "Productividad",
            muiTableHeadCellProps: {
              sx: { backgroundColor: "var(--color-primario)", color: "white" },
            },
            Cell: ({ cell }) => (
                <Box
                  component="span"
                  sx={(theme) => ({
                    backgroundColor:
                      cell.getValue() < 80
                        ? theme.palette.error.dark
                        : theme.palette.success.dark,
                    borderRadius: "0.25rem",
                    color: "#fff",
                    maxWidth: "9ch",
                    p: "0.25rem",
                  })}
                >
                {cell.getValue()}%
                </Box>
              ),
          },
  
        ],
        []
      );
    return (

    <>
      <BoxGeneral texto="Productividad">
        <Box>
            
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Seleccione rango</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
             value= {tipo}
              onChange= {e => setTipo(e.target.value)}
            >
              <FormControlLabel
                value="actual"
                control={<Radio />}
                label="Actual"
              />
              <FormControlLabel value="semana" control={<Radio />} label="Semana" />
            
            </RadioGroup>
          </FormControl>
          <Button sx={{ m: 1 , p: 5}} onClick={() => BuscarProductvidad()}>
          <SearchIcon />
        </Button>
        </Box>
        <Box>
        <MaterialReactTable data={productividad} columns={columns} />
        </Box>
      </BoxGeneral>
    </>
  );
};

export default Productividad;
