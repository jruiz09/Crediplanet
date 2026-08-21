const db = require("../models");
const CreditoDetalle = db.CreditoDetalle;
const Credito = db.Credito;

const LineaCredito = async (req, res) => {
    try {
        console.log ("request", req.body)
        const IDCREDITO = req.body.idcredito
        const ExisteCredito = await Credito.findOne({
            where: { idcredito: IDCREDITO },
          });

          if (!ExisteCredito) {
            console.log("NO EXISTE CREDITO");
            return false;
          } else {
            console.log("EXISTE CREDITO")
            await CreditoDetalle.create(req.body);
          }  
          return true;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

module.exports = {
    LineaCredito,
}