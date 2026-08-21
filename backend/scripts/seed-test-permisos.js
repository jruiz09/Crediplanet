require("dotenv").config();
const db = require("../models");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    const empresa = await db.Empresa.create({ razonsocial: "Empresa Test" });

    const cobradorActivo = await db.Cobrador.create({
      nombreyapellido: "Cobrador Activo",
      dni: 11111111,
      celular: "111",
      idempresa: empresa.idempresa,
      activo: true
    });

    const cobradorInactivo = await db.Cobrador.create({
      nombreyapellido: "Cobrador Inactivo",
      dni: 22222222,
      celular: "222",
      idempresa: empresa.idempresa,
      activo: false
    });

    const rolUser = await db.role.create({ id: 1, name: "user" });
    const rolAdmin = await db.role.create({ id: 3, name: "admin" });

    const pantallaClientesAdm = await db.Pantalla.create({
      codigo: "CLIENTES",
      nombre: "Clientes",
      app: "adm"
    });
    const pantallaCobradoresAdm = await db.Pantalla.create({
      codigo: "COBRADORES",
      nombre: "Cobradores",
      app: "adm"
    });
    const pantallaRutaMobile = await db.Pantalla.create({
      codigo: "RUTA_COBRANZA",
      nombre: "Ruta de cobranza",
      app: "mobile"
    });

    // El rol "user" solo tiene permiso sobre CLIENTES (adm) y RUTA_COBRANZA (mobile).
    // COBRADORES (adm) queda fuera a propósito para probar el caso negativo.
    await rolUser.setPantallas([pantallaClientesAdm.id, pantallaRutaMobile.id]);

    const passwordHash = bcrypt.hashSync("test1234", 8);

    const userConCobradorActivo = await db.user.create({
      username: "usuario.mobile.ok",
      email: "mobile.ok@test.com",
      password: passwordHash,
      idempresa: empresa.idempresa,
      idcobrador: cobradorActivo.idcobrador
    });
    await userConCobradorActivo.setRoles([rolUser.id]);

    const userSinCobrador = await db.user.create({
      username: "usuario.sin.cobrador",
      email: "sin.cobrador@test.com",
      password: passwordHash,
      idempresa: empresa.idempresa,
      idcobrador: null
    });
    await userSinCobrador.setRoles([rolUser.id]);

    const userConCobradorInactivo = await db.user.create({
      username: "usuario.cobrador.inactivo",
      email: "cobrador.inactivo@test.com",
      password: passwordHash,
      idempresa: empresa.idempresa,
      idcobrador: cobradorInactivo.idcobrador
    });
    await userConCobradorInactivo.setRoles([rolUser.id]);

    console.log(JSON.stringify({
      empresaId: empresa.idempresa,
      userConCobradorActivoId: userConCobradorActivo.id,
      userSinCobradorId: userSinCobrador.id,
      userConCobradorInactivoId: userConCobradorInactivo.id
    }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("SEED ERROR:", error);
    process.exit(1);
  }
})();
