const db = require("../models");
const RendicionDiaria = db.RendicionDiaria
const RendicionSemanal = db.RendicionSemanal
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../models");



const getRendicionDiaria = async (req, res) => {
  console.log("req body", req.body)

    const FECHADESDE = req.body.fechadesde;
    const FECHAHASTA = req.body.fechahasta; 
    try {
      /*const sqlquery = 
      "Select SUM(estimado) estimado, SUM(`real`) `real`, "+  
      "ROUND(IFNULL(SUM(`real`), 0) * 100 / SUM(estimado), 0) AS `Productividad` from rendiciondiaria where fechacarga BETWEEN '" +FECHADESDE+ "' and '"+FECHAHASTA+"' and idcobrador = "+IDCOBRADOR+"";
      ¨*/
       const sqlquery = 
      "SELECT " +
      "CAST(CURRENT_TIMESTAMP() AS DATE) AS `Fecha`, " +
      "COALESCE(est.idcobrador, real_sub.idcobrador) AS `idcobrador`, " +
      "COALESCE(est.cobrador, real_sub.cobrador) AS `cobrador`, " +
      "IFNULL(est.Estimado,0) AS `Estimado`, " +
      "IFNULL(real_sub.MontoReal,0) AS `Real`, " +
      "ROUND(IFNULL(real_sub.MontoReal,0) * 100 / NULLIF(est.Estimado,0),0) AS `Productividad` " +
      "FROM ( " +
      "   SELECT c.idcobrador, c.cobrador, SUM(cd.monto) AS Estimado " +
      "   FROM creditosdetalles cd " +
      "   INNER JOIN creditos c ON c.idcredito = cd.idcredito " +
      "   WHERE cd.refinanciado IS NULL " +
      "     AND CAST(cd.fechapago AS DATE) BETWEEN '" + FECHADESDE + "' AND '" + FECHAHASTA + "' " +
      "AND (cd.estado <> 'Pago Registrado' OR CAST(cd.fechaedicion AS DATE) BETWEEN '" + FECHADESDE + "' AND '" + FECHAHASTA + "' )" +
      "   GROUP BY c.idcobrador, c.cobrador " +
      ") est " +
      "LEFT JOIN ( " +
      "   SELECT c.idcobrador, c.cobrador, SUM(cj.monto) AS MontoReal " +
      "   FROM cajas cj " +
      "   INNER JOIN creditos c ON c.idcredito = SUBSTRING_INDEX(cj.transacciondocumento, '/', 1) " +
      "   WHERE cj.tipo = 'Ingreso' " +
      "     AND CAST(cj.fechaalta AS DATE) BETWEEN '" + FECHADESDE + "' AND '" + FECHAHASTA + "' " +
      "   GROUP BY c.idcobrador, c.cobrador " +
      ") real_sub ON est.idcobrador = real_sub.idcobrador";
      const rendicion = await sequelize.query(sqlquery, {
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(rendicion);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
};


/**
const getRendicionDiaria = async (req, res) => {
  console.log("req body", req.body)

    const FECHADESDE = req.body.fechadesde;
    const FECHAHASTA = req.body.fechahasta; 
    try {
      const sqlquery = 
      "SELECT "+
      "CAST(CURRENT_TIMESTAMP() AS DATE) AS `Fecha`, "+
      "`c`.`idcobrador` AS `idcobrador`,"+
      "`c`.`cobrador` AS `cobrador`,"+
      "SUM(`cd`.`monto`) AS `Estimado`, "+
      "IFNULL(SUM(`cd`.`montopago`), 0) AS `Real`, "+
      "ROUND(IFNULL(SUM(`cd`.`montopago`), 0) * 100 / SUM(`cd`.`monto`), "+
       "       0) AS `Productividad` "+
      
      "FROM (`creditosdetalles` `cd` "+
      " JOIN `creditos` `c` ON (`c`.`idcredito` = `cd`.`idcredito`)) "+
      " where CAST(`cd`.`fechapago` AS DATE) BETWEEN '" +FECHADESDE+ "' and '"+FECHAHASTA+"' "+
      "  GROUP BY `c`.`idcobrador` , `c`.`cobrador` "
      const rendicion = await sequelize.query(sqlquery, {
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(rendicion);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
}
 **/



const getRendicionSemanal = async (req, res) => {
    const FECHADESDE = req.body.fechadesde;
    const FECHAHASTA = req.body.fechahasta; 
    RendicionSemanal.findAll(
        {
            where: {fechacarga: {
                [Op.between]: [FECHADESDE, FECHAHASTA]
            }}
        }, {
    
    order: [["idrendicion", "desc"]],
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


//Select SUM(estimado) estimado, SUM(`real`) `real`,  ROUND(IFNULL(SUM(`real`), 0) * 100 / SUM(estimado), 0) AS `Productividad` from rendiciondiaria where fechacarga >= 
const getRendicionPorCobrador = async (req, res) => {
  console.log("req body", req.body)

    const FECHADESDE = req.body.fechadesde;
    const FECHAHASTA = req.body.fechahasta; 
    const IDCOBRADOR = req.body.idcobrador; 
    try {
      /*const sqlquery = 
      "Select SUM(estimado) estimado, SUM(`real`) `real`, "+  
      "ROUND(IFNULL(SUM(`real`), 0) * 100 / SUM(estimado), 0) AS `Productividad` from rendiciondiaria where fechacarga BETWEEN '" +FECHADESDE+ "' and '"+FECHAHASTA+"' and idcobrador = "+IDCOBRADOR+"";
      ¨*/
      const sqlquery = 
      "Select SUM(estimado) estimado,"+
      " SUM(`real`) `real`, "+  
      " ROUND(IFNULL(SUM(`real`), 0) * 100 / SUM(estimado), 0) AS `Productividad`"+ 
      " from (Select SUM(`real`) `real`, idcobrador from rendiciondiaria where CAST(fechacarga as date) BETWEEN '" +FECHADESDE+ "' and '"+FECHAHASTA+"' and rendiciondiaria.nocontabiliza = 0  and rendiciondiaria.idcobrador = "+IDCOBRADOR+" group by idcobrador) rendiciondiaria"+ 
      " inner join"+ 
      " (select sum(creditosdetalles.monto) estimado, creditos.idcobrador "+
      " from creditosdetalles "+
      " inner join creditos on creditos.idcredito = creditosdetalles.idcredito "+
      " where idcobrador = "+IDCOBRADOR+" " +
      " and  CAST(creditosdetalles.fechapago as date) "+
      " BETWEEN '" +FECHADESDE+ "' and '"+FECHAHASTA+"'  group by idcobrador) est "+
      " on est.idcobrador = rendiciondiaria.idcobrador "
      const rendicion = await sequelize.query(sqlquery, {
        type: QueryTypes.SELECT,
      });
      return res.status(200).json(rendicion);
    } catch (error) {
      console.log(error);
      res.json({ message: error.message });
    }
};

const getRendicionPorCobradorDetalles = async (req, res) => {
  const FECHADESDE = req.body.fechadesde;
  const FECHAHASTA = req.body.fechahasta;
  const IDCOBRADOR = req.body.idcobrador;

  try {
    const sqlquery = `
      SELECT  
        c.cliente,
        c.idcredito,
        cd.cuota AS Cuota,
        cd.fechapago AS FechaPago,
        cd.estado AS Estado,
        cd.monto AS MontoCuota,
        IFNULL(cd.montopago, 0) AS MontoPago,
        c.idcobrador AS idcobrador,
        c.cobrador AS cobrador
      FROM creditosdetalles cd
      INNER JOIN creditos c ON c.idcredito = cd.idcredito
      WHERE CAST(cd.fechapago AS DATE) 
        BETWEEN '${FECHADESDE}' AND '${FECHAHASTA}'
        AND c.idcobrador = ${IDCOBRADOR}
        AND cd.refinanciado is null
	AND cd.estado <> 'Pago Registrado'
      ORDER BY cd.estado DESC
    `;

    const rendicion = await sequelize.query(sqlquery, {
      type: QueryTypes.SELECT,
    });

    return res.status(200).json(rendicion);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
    getRendicionDiaria,
    getRendicionSemanal,
    getRendicionPorCobrador,
    getRendicionPorCobradorDetalles,
}