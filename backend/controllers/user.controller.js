const db = require("../models");
const bcrypt = require("bcryptjs");
const User = db.user;
const Role = db.role;

exports.postUsuario = async (req, res) => {
  try {
    const { username, email, password, idempresa, idcobrador, rolIds } = req.body;

    if (!username || !email || !password || !idempresa) {
      return res.status(400).send({ message: "username, email, password e idempresa son obligatorios" });
    }

    const existente = await User.findOne({
      where: { [db.Sequelize.Op.or]: [{ username }, { email }] }
    });
    if (existente) {
      return res.status(400).send({ message: "Ya existe un usuario con ese username o email" });
    }

    const usuario = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      idempresa,
      idcobrador: idcobrador || null
    });

    if (Array.isArray(rolIds) && rolIds.length > 0) {
      await usuario.setRoles(rolIds);
    }

    const usuarioCreado = await User.findByPk(usuario.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Role, through: { attributes: [] } }]
    });

    res.status(200).send({ message: "Usuario creado correctamente", data: usuarioCreado });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: Role, through: { attributes: [] } }],
      order: [["id", "ASC"]]
    });
    res.status(200).send(usuarios);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getUsuario = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Role, through: { attributes: [] } }]
    });
    if (!usuario) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }
    res.status(200).send(usuario);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.putUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const body = { ...req.body };
    delete body.password;
    delete body.id;

    const [num] = await User.update(body, { where: { id } });

    if (num === 1) {
      res.status(200).send({ message: "Usuario actualizado correctamente" });
    } else {
      res.status(400).send({ message: `No se puede actualizar el usuario id=${id}.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.setRolesUsuario = async (req, res) => {
  try {
    const id = req.params.id;
    const { rolIds } = req.body;

    if (!Array.isArray(rolIds)) {
      return res.status(400).send({ message: "rolIds debe ser un array" });
    }

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    await usuario.setRoles(rolIds);
    res.status(200).send({ message: "Roles del usuario actualizados correctamente" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.allAccess = (req, res) => {
  res.status(200).send("OK");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
