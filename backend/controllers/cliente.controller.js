const db = require("../models");
const Cliente = db.Cliente;
const Cobrador = db.Cobrador;

const path = require("path");
const dotenv = require("dotenv")
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");
const multer = require("multer");
const Credito = db.Credito;

const getCliente = async (req, res) => {
  Cliente.findAll({
    order: [["nombreyapellido", "ASC"]],
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Ocurrio un error",
      });
    });
};

const getClientexEmpresa = async (req, res) => {
      Cliente.findAll({
        order: [["idcliente", "DESC"]],
      })
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Ocurrio un error",
          });
        });
    };
    
/*
const postCliente = async (req, res) => {
    const IDEMPRESA = req.body.idempresa;
    const IDCOBRADOR = req.body.idcobrador;

    if(!IDEMPRESA)
    {
        res.status(400).send({
            message: "Error : el idempresa es obligatorio",
          });
    }


  else {
    if(!IDCOBRADOR)
    {
        res.status(400).send({
            message: "Error : el idcobrador es obligatorio",
          });
    }
    else 
    {
        const ExisteCobrador = await Cobrador.findOne({
            where: { idcobrador: IDCOBRADOR },
          });

          if (ExisteCobrador)
          {
            const Post = {
                nombreyapellido : req.body.nombreyapellido,
                direccion : req.body.direccion,
                celular: req.body.celular,
                idempresa: IDEMPRESA,
                idcobrador: IDCOBRADOR,
                nombrecobrador : req.body.nombrecobrador,
              }
            try {
              await Cliente.create( Post ).then((data) => {
                res.status(200).send({
                  message: "Cliente creado correctamente",
                  data: data,
                });
              });
            } catch (error) {
              res.json({ message: "ERROR: " + error.message });
            }
          }
          else {
            res.status(400).send({
                message: "Error : el cobrador no existe",
              });
          }
   
    }
  }
};
*/

const postCliente = async (req, res) => {
  if (req.file) {
  console.log("Archivo recibido:", req.file.filename);
}
  const IDCOBRADOR = req.body.idcobrador;
  if(!IDCOBRADOR)
    {
        res.status(400).send({
            message: "Error : el idcobrador es obligatorio",
          });
    }
    else 
    {
        const ExisteCobrador = await Cobrador.findOne({
            where: { idcobrador: IDCOBRADOR },
          });

          if (ExisteCobrador)
          {
            const Post = {
                nombreyapellido : req.body.nombreyapellido,
                direccion : req.body.direccion,
                celular: req.body.celular,
                idcobrador: IDCOBRADOR,
                nombrecobrador : req.body.nombrecobrador,
                foto: req.file ? req.file.filename : null, // ✅ imagen opcional
              }
            try {
              await Cliente.create( Post ).then((data) => {
                res.status(200).send({
                  message: "Cliente creado correctamente",
                  data: data,
                });
              });
            } catch (error) {
              res.json({ message: "ERROR: " + error.message });
            }
          }
          else {
            res.status(400).send({
                message: "Error : el cobrador no existe",
              });
          }
        }
};

// 8. Upload Image Controller

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.CARPETA);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "crediplanet" + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("foto");


const putCliente = async (req, res) => {
  try {
    if (req.file) {
      console.log("Archivo recibido:", req.file.filename);
    }

    const IDCliente = req.params.idcliente;
    const IDCOBRADOR = req.body.idcobrador;
    const COBRADOR = req.body.nombrecobrador;

    // Update Credito
    const UpdatePost = {
      idcobrador: IDCOBRADOR,
      cobrador: COBRADOR,
    };

    console.log("update credito ", UpdatePost);

    await Credito.update(UpdatePost, {
      where: {
        idcliente: IDCliente,
        estado: ["Pendiente", "En Proceso"],
      },
    });

    // Update Cliente
    const Post = {
      nombreyapellido: req.body.nombreyapellido,
      direccion: req.body.direccion,
      celular: req.body.celular,
      idcobrador: IDCOBRADOR,
      nombrecobrador: req.body.nombrecobrador,
    };

    // 👉 Solo agrego foto si viene en el request
    if (req.file) {
      Post.foto = req.file.filename;
    }

    const num = await Cliente.update(Post, {
      where: { idcliente: IDCliente },
    });

    if (num == 1) {
      res.status(200).send({
        message: "Cliente actualizado correctamente",
      });
    } else {
      res.status(400).send({
        message: `No se pudo actualizar el Cliente id=${IDCliente}.`,
      });
    }
  } catch (err) {
    console.error("Error en putCliente:", err);
    res.status(500).send({
      message: "Error: " + err,
    });
  }
};



const deleteCliente = async (req, res) => {
    const id = req.params.idcliente;

  Cliente.destroy({
    where: { idcliente: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Cliente eliminado correctamente"
        });
      } else {
        res.status(400).send({
          message: `No se puede eliminar el Cliente id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error: "+ err
      });
    });
  };

  const getClientesMorosos = async (req, res) => {
    try {
      const sqlquery = "Select * from vw_clientesmorosos";
      const rendicion = await sequelize.query(sqlquery, {
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(rendicion);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  };


  // No hay FK entre el crédito refinanciado y el que lo reemplaza: se toma el primer
  // crédito posterior del cliente dado de alta desde el día de la refinanciación.
  const agregarCreditoRefinanciador = async (idcliente, creditos) => {
    if (!creditos.some((c) => c.cuotasrefinanciadas > 0 || c.estado === "Refinanciado")) {
      return creditos;
    }
    const creditosCliente = await Credito.findAll({
      attributes: ["idcredito", "monto", "estado", "fechaalta"],
      where: { idcliente },
      order: [["idcredito", "ASC"]],
      raw: true,
    });
    const dia = (fecha) => (fecha ? new Date(fecha).toISOString().slice(0, 10) : "");
    return creditos.map((credito) => {
      if (!(credito.cuotasrefinanciadas > 0 || credito.estado === "Refinanciado")) {
        return credito;
      }
      const nuevo = creditosCliente.find(
        (c) =>
          c.idcredito > credito.idcredito &&
          dia(c.fechaalta) >= dia(credito.fecharefinanciacion)
      );
      return {
        ...credito,
        refinanciadoen: nuevo
          ? { idcredito: nuevo.idcredito, monto: nuevo.monto, estado: nuevo.estado }
          : null,
      };
    });
  };

  const getResumenClienteEstado = async (req, res) => {
    try {
      const idcliente = req.params.idcliente
      const sqlquery = "Select CAST(MIN(fechaalta) as date) fecha, count(idcredito) Cantidad, creditos.idcliente, nombreyapellido as cliente, estado from creditos  " +
                        "inner join clientes on clientes.idcliente = creditos.idcliente "+
                        "where creditos.idcliente = '"+idcliente+"' "+
                        "group by creditos.idcliente ,nombreyapellido, estado";
      const rendicion = await sequelize.query(sqlquery, {
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(rendicion);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  };

 const getResumenClienteUltimosCreditosDetalles = async (req, res) => {
    try {
      const idcliente = req.params.idcliente
      const sqlquery = "SELECT DATEDIFF(fechaedicion, fechapago) diasdeatraso, idcredito, cuota, tipotransaccion, fechapago, fechaedicion, COALESCE(refinanciado, 0) refinanciado"+
                  " FROM creditosdetalles "+
                  " WHERE idcredito IN ("+
                  " SELECT idcredito FROM ("+
                  " SELECT idcredito "+
                  " FROM creditos"+
                  " WHERE idcliente = :idcliente AND estado IN ('Finalizado', 'Refinanciado')"+
                  " ORDER BY idcredito DESC LIMIT 3) AS ultimos_creditos);";
      const rendicion = await sequelize.query(sqlquery, {
        replacements: { idcliente },
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(rendicion);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  };

   const getResumenClienteUltimosCreditos = async (req, res) => {
    try {
      const idcliente = req.params.idcliente
      // Las cuotas refinanciadas no se pagaron: se cuentan aparte y no como atraso
      const sqlquery = " SELECT creditosdetalles.idcredito, max(creditos.monto) monto, max(creditos.estado) estado, max(creditos.fechainicio) fechainicio, "
                        + " COUNT(CASE WHEN COALESCE(creditosdetalles.refinanciado, 0) = 0 AND DATEDIFF(creditosdetalles.fechaedicion, creditosdetalles.fechapago) <= 0 THEN 1 END) AS sinatraso, "
                        + " COUNT(CASE WHEN COALESCE(creditosdetalles.refinanciado, 0) = 0 AND DATEDIFF(creditosdetalles.fechaedicion, creditosdetalles.fechapago) BETWEEN 1 AND 4 THEN 1 END) AS atrasohasta4dias, "
                        + " COUNT(CASE WHEN COALESCE(creditosdetalles.refinanciado, 0) = 0 AND DATEDIFF(creditosdetalles.fechaedicion, creditosdetalles.fechapago) > 4 THEN 1 END) AS atrasomas4dias, "
                        + " COUNT(CASE WHEN creditosdetalles.refinanciado = 1 THEN 1 END) AS cuotasrefinanciadas, "
                        + " MAX(CASE WHEN creditosdetalles.refinanciado = 1 THEN creditosdetalles.fechaedicion END) AS fecharefinanciacion "
                        + " FROM creditosdetalles  inner join creditos on creditos.idcredito = creditosdetalles.idcredito"
                        + " WHERE creditosdetalles.idcredito  IN ("
                        + " SELECT idcredito FROM ("
                        + " SELECT idcredito "
                        + " FROM creditos "
                        + " WHERE idcliente = :idcliente AND estado IN ('Finalizado', 'Refinanciado')"
                        + " ORDER BY idcredito DESC"
                        + " LIMIT 3"
                        + " ) AS ultimos_creditos) GROUP BY creditosdetalles.idcredito ORDER BY creditosdetalles.idcredito DESC;";
      const rendicion = await sequelize.query(sqlquery, {
        replacements: { idcliente },
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(await agregarCreditoRefinanciador(idcliente, rendicion));
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  };

    const getRefinanciado = async (req, res) => {
    try {
      const idcliente = req.params.idcliente
      const sqlquery = "Select creditosdetalles.refinanciado from creditos  " +
                        "inner join clientes on clientes.idcliente = creditos.idcliente "+
                        "inner join creditosdetalles on creditosdetalles.idcredito = creditos.idcredito "+
                        "where creditos.idcliente = '"+idcliente+"' "+
                        "and creditosdetalles.refinanciado = '1' LIMIT 1";
      const rendicion = await sequelize.query(sqlquery, {
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(rendicion);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
  };

  const getCreditosRefinanciados = async (req, res) => {
    try {
      const sqlquery = "SELECT creditos.idcredito, MAX(creditos.monto) monto, MAX(creditos.estado) estado, MAX(creditos.fechainicio) fechainicio, " +
                        "COUNT(creditosdetalles.idcreditodetalle) cuotasrefinanciadas, MAX(creditosdetalles.fechaedicion) fecharefinanciacion " +
                        "FROM creditos " +
                        "LEFT JOIN creditosdetalles ON creditosdetalles.idcredito = creditos.idcredito AND creditosdetalles.refinanciado = 1 " +
                        "WHERE creditos.idcliente = :idcliente " +
                        "AND (creditos.estado = 'Refinanciado' OR creditosdetalles.idcreditodetalle IS NOT NULL) " +
                        "GROUP BY creditos.idcredito " +
                        "ORDER BY creditos.idcredito DESC";
      const creditos = await sequelize.query(sqlquery, {
        replacements: { idcliente: req.params.idcliente },
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(await agregarCreditoRefinanciador(req.params.idcliente, creditos));
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  getCliente,
  getClientexEmpresa,
  postCliente,
  putCliente,
  deleteCliente,
  getClientesMorosos,
  getResumenClienteEstado,
  getResumenClienteUltimosCreditos,
  getResumenClienteUltimosCreditosDetalles,
  upload,
  getRefinanciado,
  getCreditosRefinanciados
};
