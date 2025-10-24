import express from "express";
import expressAsyncHandler from "express-async-handler";
import Cliente from "../models/cliente.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const clienteRouter = express.Router();

clienteRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const clientes = await Cliente.find({});
    res.send(clientes);
  })
);

clienteRouter.get(
  "/rif/:rif",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findOne({ rif: req.params.rif });
    if (cliente) {
      res.send(cliente);
    } else {
      res.status(404).send({ message: "Cliente No Existe" });
    }
  })
);

clienteRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    if (cliente) {
      res.send(cliente);
    } else {
      res.status(404).send({ message: "Cliente No Existe" });
    }
  })
);

clienteRouter.post(
  "/register",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const empleado = new Cliente({
      nombre: req.body.nombre,
      rif: req.body.rif,
      email: req.body.email,
      celular: req.body.celular,
      direccion: req.body.direccion,
      canal: req.body.canal,
      timestamp: req.body.timestamp,
    });
    const createdcliente = await empleado.save();
    res.send({
      _id: createdcliente._id,
      nombre: createdcliente.nombre,
      rif: createdcliente.rif,
      email: createdcliente.email,
      celular: createdcliente.celular,
      direccion: createdcliente.direccion,
      canal: createdcliente.canal,
      timestamp: createdcliente.timestamp,
    });
  })
);

clienteRouter.put(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const clienteId = req.params.id;
    const cliente = await Cliente.findById(clienteId);
    if (cliente) {
      cliente.nombre = req.body.nombre || cliente.nombre;
      cliente.rif = req.body.rif || cliente.rif;
      cliente.email = req.body.email || cliente.email;
      cliente.celular = req.body.celular || cliente.celular;
      cliente.direccion = req.body.direccion || cliente.direccion;
      cliente.canal = req.body.canal || cliente.canal;

      const updatedCliente = await cliente.save();
      res.send({
        _id: updatedCliente._id,
        nombre: updatedCliente.nombre,
        rif: updatedCliente.rif,
        email: updatedCliente.email,
        celular: updatedCliente.celular,
        direccion: updatedCliente.direccion,
        canal: updatedCliente.canal,
      });
    } else {
      res.status(404).send({ message: "Cliente No Encontrado" });
    }
  })
);

clienteRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    if (cliente) {
      const deleteCliente = await cliente.deleteOne({ _id: req.params.id });
      res.send({
        message: "Cliente Eliminado",
        cliente: deleteCliente,
      });
    } else {
      res.status(404).send({ message: "Cliente No Encontrado" });
    }
  })
);

export default clienteRouter;
