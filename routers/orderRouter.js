import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/pedido.js";
import User from "../models/user.js";
import Producto from "../models/producto.js";
import Cliente from "../models/cliente.js";
import { isAdmin, isAuth } from "../utils.js";
import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

const orderRouter = express.Router();
orderRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log("get orders");
    const orders = await Order.find({}, { _id: 1, fecha: 1, "clienteInfo.nombre": 1, totalVenta: 1 }).sort({
      createdAt: -1,
    });
    res.send(orders);
  })
);

orderRouter.get(
  "/cambiobcv",
  expressAsyncHandler(async (req, res) => {
    const url = "https://www.bcv.org.ve/";
    try {
      const response = await axios.get(url, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
      if (response && response.data) {
        const $ = cheerio.load(response.data);
        //console.log("data:", response.data);
        const fecha = $(".date-display-single").text();
        const data = $("#dolar strong").text();
        const euro = $("#euro strong").text();
        const rateFormatted = Number(data.replace(",", ".")).toFixed(2);
        const euroFormatted = Number(euro.replace(",", ".")).toFixed(2);

        res.json({ success: true, cambiobcv: Number(rateFormatted), euro: euroFormatted, fecha: fecha });
      } else {
        res.json({ success: false, message: "Error al obtener el precio del BCV" });
      }
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  })
);

orderRouter.get(
  "/cuadrediario",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const fecha1 = req.query.fecha;
    const dia = Number(fecha1.substr(8, 2));
    const mes = Number(fecha1.substr(5, 2));
    const ano = Number(fecha1.substr(0, 4));

    const count = await Order.countDocuments({});

    const orders = await Order.aggregate([
      {
        $project: {
          _id: 1,
          user: 1,
          fecha: 1,
          orderItems: 1,
          subtotal: 1,
          totalVenta: 1,
          subtotal: 1,
          observaciones: 1,
          totalItems: 1,
          cambioDia: 1,
          pago: 1,
          memo: 1,
          delivery: 1,
          descuento: 1,
          cambioDia: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
    ]).sort({ fecha: 1 });

    const cash = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $group: {
          _id: null,
          totalCashusd: { $sum: "$pago.efectivousd" },
          totalCashbs: { $sum: "$pago.efectivobs" },
          totalCasheuros: { $sum: "$pago.efectivoeuros" },
          totalpagomobil: { $sum: "$pago.pagomovil.montopagomovil" },
          totalzelle: { $sum: "$pago.zelle.montozelle" },
          totalcashea: { $sum: "$pago.cashea.monto" },
        },
      },
    ]);

    const puntoPlz = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Plaza" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntoplaza: { $sum: "$pago.punto.montopunto" },
        },
      },
    ]);

    const puntoPlz2 = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto2",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Plaza" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntoplaza: { $sum: "$pago.punto.montopunto2" },
        },
      },
    ]);

    const puntoPlz3 = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto3",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Plaza" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntoplaza: { $sum: "$pago.punto.montopunto3" },
        },
      },
    ]);

    const puntoVzl = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Venezuela" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntovzla: { $sum: "$pago.punto.montopunto" },
        },
      },
    ]);

    const puntoVzl2 = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto2",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Venezuela" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntovzla: { $sum: "$pago.punto.montopunto2" },
        },
      },
    ]);

    const puntoVzl3 = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto3",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Venezuela" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntovzla: { $sum: "$pago.punto.montopunto3" },
        },
      },
    ]);

    const puntobanes = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Banesco" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntobanes: { $sum: "$pago.punto.montopunto" },
        },
      },
    ]);

    const puntobanes2 = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto2",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Banesco" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntobanes: { $sum: "$pago.punto.montopunto2" },
        },
      },
    ]);

    const puntobanes3 = await Order.aggregate([
      {
        $project: {
          fecha: 1,
          pago: 1,
          createdAt: 1,
          day: { $dayOfMonth: "$fecha" },
          month: { $month: "$fecha" },
          year: { $year: "$fecha" },
          fecha: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          banco: "$pago.punto.bancodestinopunto3",
        },
      },
      {
        $match: {
          day: { $eq: dia },
          month: { $eq: mes },
          year: { $eq: ano },
        },
      },
      {
        $match: {
          banco: { $eq: "Banesco" },
        },
      },
      {
        $group: {
          _id: null,
          totalpuntobanes: { $sum: "$pago.punto.montopunto3" },
        },
      },
    ]);

    const puntoPlaza = [...puntoPlz, ...puntoPlz2, ...puntoPlz3];
    const puntoVenezuela = [...puntoVzl, ...puntoVzl2, ...puntoVzl3];
    const puntoBanesco = [...puntobanes, ...puntobanes2, ...puntobanes3];

    res.send({ orders, cash, puntoPlaza, puntoVenezuela, puntoBanesco });
  })
);

orderRouter.get(
  "/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const code = "AG-001";
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$subtotal" },
        },
      },
    ]);

    const zapatosVendidos = await Order.aggregate([
      {
        $unwind: "$orderItems",
      },
      {
        $group: {
          _id: "$nombre",
          vendidos: { $sum: "$orderItems.qty" },
        },
      },
    ]);

    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);

    const clientes = await Cliente.aggregate([
      {
        $group: {
          _id: null,
          numClientes: { $sum: 1 },
        },
      },
    ]);

    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$subtotal" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const paresZapatos = await Producto.aggregate([
      {
        $group: {
          _id: null,
          existenciaActual: { $sum: "$existencia" },
        },
      },
    ]);

    const productCategories = await Producto.aggregate([
      {
        $group: {
          _id: "$categoria",
          count: { $sum: 1 },
        },
      },
    ]);

    const valorTotalStock = await Producto.aggregate([
      {
        $group: {
          _id: null,
          valorInventario: {
            $sum: { $multiply: ["$preciousd", "$existencia"] },
          },
        },
      },
    ]);

    const costoTotalStock = await Producto.aggregate([
      {
        $group: {
          _id: null,
          costoInventario: { $sum: "$costousd" },
        },
      },
    ]);

    const historialItem = await Order.aggregate([
      {
        $unwind: "$orderItems",
      },
      { $match: { "orderItems.codigo": code } },

      {
        $group: {
          _id: "$orderItems.codigo",
          vendidos: { $sum: "$orderItems.qty" },
          detalles: {
            $push: {
              fecha: "$createdAt",
              idNota: "$_id",
              cliente: "$clienteInfo.nombre",
              codigo: "$orderItems.codigo",
              talla: "$orderItems.talla",
              cantidad: "$orderItems.qty",
              imgurl: "$orderItems.imageurl",
            },
          },
        },
      },
      {
        $sort: {
          vendidos: -1,
        },
      },
      { $limit: 20 },
    ]);

    res.send({
      users,
      orders,
      dailyOrders,
      clientes,
      paresZapatos,
      zapatosVendidos,
      valorTotalStock,
      costoTotalStock,
      historialItem,
    });
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Cart is empty" });
    } else {
      const order = new Order({
        tipo: "venta",
        fecha: req.body.fecha,
        user: req.user._id,
        clienteInfo: req.body.clienteInfo,
        pago: req.body.pago,
        kabanState: "PENDIENTE",
        orderItems: req.body.orderItems,
        totalItems: req.body.totalItems,
        descuento: req.body.descuento,
        delivery: req.body.delivery,
        subtotal: req.body.subtotal,
        iva: req.body.iva,
        totalVenta: req.body.totalVenta,
        metodopago: req.body.metodopago,
        cambioDia: req.body.cambioDia,
        condicion: req.body.condicion,
        vendedor: req.body.vendedor,
        deliveryInfo: req.body.deliveryInfo,
        memo: req.body.memo,
        searchstring: req.body.clienteInfo.nombre.concat(
          " ",
          "venta",
          " ",
          req.body.clienteInfo.rif,
          " ",
          req.body.orderItems.map((item) => item.codigo + " "),
          " "
        ),
      });
      const createdOrder = await order.save();

      if (createdOrder) {
        for (let index = 0; index < createdOrder.orderItems.length; index++) {
          let item = createdOrder.orderItems[index];

          const id = item.producto;
          const qty = Number(item.qty);
          const talla = String(item.talla);

          //get product
          const prod = await Producto.findById(id);

          if (prod) {
            const stock = prod.existencia;
            const sizes = prod.tallas;
            const actualValue = sizes[talla];
            const newValue = actualValue - qty;
            Producto.findByIdAndUpdate(id, {
              existencia: stock - qty,
              tallas: { ...sizes, [talla]: newValue },
            })
              .then((result) => console.log(result.codigo))
              .catch((err) => console.log(err));
          }
        }

        res.status(201).send({
          message: "existencia Actualizada OK!",
          order: createdOrder,
        });
      } else {
        res.status(404).send({ message: "Ocurrio un Error" });
      }

      /*   res
        .status(201)
        .send({ message: "Se Ha Creado un Nuevo Pedido", order: createdOrder }); */
    }
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate({
        path: "user",
        select: "nombre apellido",
      })
      .populate({
        path: "vendedor",
        select: "nombre apellido",
      });
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "No se Encontro el Pedido" });
    }
  })
);

orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: "Pedido Eliminado", order: deleteOrder });
    } else {
      res.status(404).send({ message: "Pedido No Encontrado" });
    }
  })
);

export default orderRouter;
