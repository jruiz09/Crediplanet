const db = require("../models")
const Caja = db.Caja

const MovimientoCaja = async(req, res) => {
    try {
        console.log ("request", req)
        await Caja.create(req);

        return true;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}


module.exports = {
    MovimientoCaja,
}