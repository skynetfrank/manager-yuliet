import express from "express";
import expressAsyncHandler from "express-async-handler";
import Reposicion from "../models/reposicion.js";
import User from "../models/user.js";
import Producto from "../models/producto.js";
import { isAdmin, isAuth } from "../utils.js";

const reposicionRouter = express.Router();
reposicionRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const reposiciones = await Reposicion.find({})
      .populate({
        path: "items.producto",
        select: "codigo",
      })
      .sort({ createdAt: -1 });
    res.send({ reposiciones });
  })
);

reposicionRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.items.length === 0) {
      res.status(400).send({ message: "Pedido vacio" });
    } else {
      const reposicion = new Reposicion({
        fecha: req.body.fecha,
        user: req.body.user,
        sucursal: req.body.sucursal,
        tipo: req.body.tipo,
        items: req.body.items,
        totalUnidades: req.body.totalUnidades,
        totalItems: req.body.totalItems,
        procesado: req.body.procesado,
        searchstring: req.body.sucursal.concat(
          " ",
          req.body.tipo,
          " ",
          req.body.items.map((item) => item.codigo + " "),
          " "
        ),
      });
      const createdReposicion = await reposicion.save();

      if (createdReposicion) {
        for (let index = 0; index < req.body.items.length; index++) {
          let item = req.body.items[index];
          const id = item.producto;
          const prod = await Producto.findById(id);

          if (prod) {
            const itemTallas = item.tallas;
            const cantidad = item.cantidad;
            const sizes = prod.tallas;
            const newStock = prod.existencia - cantidad;
            //crear nuevo objeto con la suma de las tallas de la db y el item recibido
            const updatedTallas = Object.keys(sizes).reduce(function (obj, k) {
              obj[k] = (obj[k] * -1 || 0) + sizes[k];
              return obj;
            }, Object.assign({}, itemTallas));

            Producto.findByIdAndUpdate(id, {
              existencia: newStock,
              tallas: updatedTallas,
            })
              .then((result) => console.log("done" + result.codigo))
              .catch((err) => console.log(err));
          }
        }

        res.status(201).send({
          message: "Reposicion Creada",
          reposicion: createdReposicion,
        });
      } else {
        res.status(404).send({ message: "Ocurrio un Error" });
      }
    }
  })
);

reposicionRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const reposicion = await Reposicion.findById(req.params.id).populate("user").populate({
      path: "items.producto",
      select: "codigo marca modelo color tipo preciousd imageurl",
    });

    if (reposicion) {
      res.send({ reposicion });
    } else {
      res.status(404).send({ message: "Reposicion Not Found" });
    }
  })
);

reposicionRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const reposicion = await Reposicion.findById(req.params.id);
    if (reposicion) {
      const deleteReposicion = await reposicion.deleteOne();
      res.send({
        message: "Reposicion Eliminada",
        reposicion: deleteReposicion,
      });
    } else {
      res.status(404).send({ message: "Pedido No Encontrado" });
    }
  })
);

reposicionRouter.put(
  "/:id/updatestatus",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const doc = await Reposicion.findById(req.params.id);
    console.log("doc:", doc);
    if (doc) {
      doc.procesado = true;
      const updatedRepo = await doc.save();
      res.send({ message: "Reposicion Actualizada", reposicion: updatedRepo });
    } else {
      res.status(404).send({ message: "Reposicion No Encontrada" });
    }
  })
);

export default reposicionRouter;
