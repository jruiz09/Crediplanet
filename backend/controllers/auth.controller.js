const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Empresa = db.Empresa;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.CambiarContrase = async (req, res) => {

  
  const ExisteUsuario = await User.findOne({
    where: { username: req.body.username },
  });

  if (ExisteUsuario)
  {
    
  try {
    
    const body = {
      password: bcrypt.hashSync(req.body.password, 8)
    }

    User.update(body, {
      where : {username: req.body.username}
  })
 
  .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Contraseña actualizada correctamente"
        });
      } else {
        res.status(400).send({
          message: `no se puede actualizar la contraseña usuario=${req.body.username}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error: " + err
      });
    });
  }
 catch (error) {
  res.status(500).send({ message: error.message });
}
  }
}

exports.signup = async (req, res) => {
  // Save User to Database

  if(!req.body.idempresa)
  {
    {
      res.status(400).send({ message: "Error : el idempresa es obligatorio" });
    }
  }
  else 
  {
    
  const ExisteEmpresa = await Empresa.findOne({
    where: { idempresa: req.body.idempresa },
  });

  if (ExisteEmpresa)
  {
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      idempresa: req.body.idempresa,
      idcobrador: req.body.idcobrador
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) res.send({
         message: "Usuario registrado correctamente!",
         data: user });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) res.send({ message: "Usuario registrado correctamente!",
      data: user });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
else
{
  res.status(400).send({ message: "La empresa no existe. ID " + req.body.idempresa  });
}
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Contraseña incorrecta!",
      });
    }

    const token = jwt.sign({ id: user.id },
                           config.secret,
                           {
                            algorithm: 'HS256',
                            allowInsecureKeySizes: true,
                            //expiresIn: 86400, // 24 hours
                            expiresIn: "365d", // 24 hours
                           });

    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      idempresa: user.idempresa,
      idcobrador: user.idcobrador,
      token: token,
      roles: authorities,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "Sesión Finalizada!"
    });
  } catch (err) {
    this.next(err);
  }
};
