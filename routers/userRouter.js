import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  "/vendedores",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({ isVendedor: true }, { _id: 1, nombre: 1, apellido: 1,cedula:1 }).sort({ nombre: 1 });
    res.send(users);
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          nombre: user.nombre,
          apellido: user.apellido,
          cedula: user.cedula,
          email: user.email,
          password: user.password,
          telefono: user.telefono,
          isAdmin: user.isAdmin,
          isVendedor: user.isVendedor,
          isActivo: true,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Email o Clave Invalidos" });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      cedula: req.body.cedula,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      telefono: req.body.telefono,
      isVendedor: true,
      isAdmin: false,
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      nombre: createdUser.nombre,
      apellido: createdUser.apellido,
      cedula: createdUser.cedula,
      email: createdUser.email,
      telefono: createdUser.telefono,
      isAdmin: createdUser.isAdmin,
      isVendedor: createdUser.isVendedor,
      token: generateToken(createdUser),
    });
  })
);

userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "Usuario No Encontrado" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.nombre = req.body.nombre || user.nombre;
      user.apellido = req.body.apellido || user.apellido;
      user.cedula = req.body.cedula || user.cedula;
      user.email = req.body.email || user.email;
      user.telefono = req.body.telefono || user.telefono;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        nombre: updatedUser.nombre,
        apellido: updatedUser.apellido,
        cedula: updatedUser.cedula,
        email: updatedUser.email,
        telefono: updatedUser.telefono,
        isAdmin: updatedUser.isAdmin,
        isVendedor: updatedUser.isVendedor,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "frank.uah@gmail.com") {
        res.status(400).send({ message: "No puedes Eliminar al Admin-Developer!" });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: "Usuario Eliminado", user: deleteUser });
    } else {
      res.status(404).send({ message: "Usuario No Encontrado" });
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.nombre = req.body.nombre || user.nombre;
      user.apellido = req.body.apellido || user.apellido;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isVendedor = Boolean(req.body.isVendedor);

      const updatedUser = await user.save();
      res.send({ message: "Usuario Actualizado", user: updatedUser });
    } else {
      res.status(404).send({ message: "Usuario No Encontrado" });
    }
  })
);

export default userRouter;
