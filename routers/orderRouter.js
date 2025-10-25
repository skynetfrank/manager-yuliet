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
  "/groupedbyday",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const dailyOrders = await Order.aggregate([
      // 1. Agrupar por día para obtener los totales y una lista de todos los items
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$fecha" } },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalVenta" },
          totalSubtotal: { $sum: "$subtotal" },
          // Aplanar todos los orderItems de todas las órdenes del día en un solo array
          allItems: { $push: "$orderItems" },
        },
      },
      // 2. Desenrollar la lista de arrays de items
      {
        $unwind: {
          path: "$allItems",
          preserveNullAndEmptyArrays: true, // ¡IMPORTANTE! Mantiene los días aunque no tengan items
        },
      },
      // 3. Desenrollar los items individuales
      {
        $unwind: {
          path: "$allItems",
          preserveNullAndEmptyArrays: true, // Mantiene los días aunque no tengan items
        },
      },
      // 4. Agrupar por día y por item para sumar cantidades
      {
        $group: {
          _id: {
            day: "$_id",
            codigo: "$allItems.codigo",
            talla: "$allItems.talla",
          },
          // Mantener los totales del día
          totalOrders: { $first: "$totalOrders" },
          totalSales: { $first: "$totalSales" },
          totalSubtotal: { $first: "$totalSubtotal" },
          // Datos del item agrupado
          nombre: { $first: "$allItems.nombre" },
          precio: { $first: "$allItems.precio" },
          imageurl: { $first: "$allItems.imageurl" },
          qtySold: { $sum: "$allItems.qty" },
          itemTotalSales: { $sum: { $multiply: ["$allItems.precio", "$allItems.qty"] } },
        },
      },
      // 5. Agrupar una última vez por día para construir el array de itemsSold
      {
        $group: {
          _id: "$_id.day",
          totalOrders: { $first: "$totalOrders" },
          totalSales: { $first: "$totalSales" },
          totalSubtotal: { $first: "$totalSubtotal" },
          itemsSold: {
            // Solo agregar al array si el item tiene un código (evita nulos)
            $push: {
              $cond: ["$_id.codigo", {
                codigo: "$_id.codigo",
                nombre: "$nombre",
                talla: "$_id.talla",
                qty: "$qtySold",
                precioUnitario: "$precio",
                totalVentaItem: "$itemTotalSales",
                imageurl: "$imageurl",
              }, "$$REMOVE"]
            },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.send(dailyOrders);
  })
);

orderRouter.get(
  "/cuadrediario",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // Validar que se reciba una fecha
    if (!req.query.fecha) {
      return res.status(400).send({ message: "La fecha es requerida." });
    }

    // Crear objetos de fecha para el inicio y fin del día.
    // Esto es más eficiente y preciso que extraer día/mes/año.
    // IMPORTANTE: Se añade 'T00:00:00' para que new Date() interprete la fecha
    // en la zona horaria local del servidor, no en UTC. Esto soluciona el problema
    // de que la búsqueda se desfase un día.
    const fechaString = req.query.fecha;
    const fechaInicio = new Date(`${fechaString}T00:00:00`);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(`${fechaString}T00:00:00`);
    fechaFin.setHours(23, 59, 59, 999);

    const results = await Order.aggregate([
      {
        // 1. Filtrar todas las órdenes del día especificado.
        $match: {
          fecha: {
            $gte: fechaInicio,
            $lt: fechaFin,
          },
        },
      },
      {
        // 2. Usar $facet para ejecutar dos pipelines en paralelo:
        // una para obtener el detalle de las órdenes y otra para el resumen de pagos.
        $facet: {
          // Pipeline para obtener la lista de órdenes del día
          orders: [
            {
              $project: {
                _id: 1,
                fecha: 1,
                orderItems: 1,
                subtotal: 1,
                totalVenta: 1,
                totalItems: 1,
                cambioDia: 1,
                pago: 1,
                memo: 1,
                delivery: 1,
                descuento: 1,
                "clienteInfo.nombre": 1,
              },
            },
            { $sort: { fecha: 1 } },
          ],
          // Pipeline para calcular el resumen de pagos
          paymentSummary: [
            // Desglosar el array de pagos para procesar cada pago individualmente
            { $unwind: "$pago" },
            {
              // Agrupar todos los pagos y sumar condicionalmente
              $group: {
                _id: null, // Agrupamos todos los documentos en uno solo
                totalDolares: { $sum: { $cond: [{ $eq: ["$pago.tipo", "DOLARES"] }, "$pago.monto", 0] } },
                totalEuros: { $sum: { $cond: [{ $eq: ["$pago.tipo", "EUROS"] }, "$pago.monto", 0] } },
                totalZelle: { $sum: { $cond: [{ $eq: ["$pago.tipo", "ZELLE"] }, "$pago.monto", 0] } },
                totalCashea: { $sum: { $cond: [{ $eq: ["$pago.tipo", "PAGOCASHEA"] }, "$pago.monto", 0] } },
                totalPagoMovil: { $sum: { $cond: [{ $eq: ["$pago.tipo", "PAGOMOVIL"] }, "$pago.monto", 0] } },
                totalBolivares: { $sum: { $cond: [{ $eq: ["$pago.tipo", "BOLIVARES"] }, "$pago.monto", 0] } },
                totalPuntoPlaza: {
                  $sum: {
                    $cond: [{ $and: [{ $in: ["$pago.tipo", ["TDC", "TDB"]] }, { $eq: ["$pago.bancoDestino", "Plaza"] }] }, "$pago.monto", 0],
                  },
                },
                totalPuntoVenezuela: {
                  $sum: {
                    $cond: [
                      { $and: [{ $in: ["$pago.tipo", ["TDC", "TDB"]] }, { $eq: ["$pago.bancoDestino", "Venezuela"] }] },
                      "$pago.monto",
                      0,
                    ],
                  },
                },
                totalPuntoBanesco: {
                  $sum: {
                    $cond: [
                      { $and: [{ $in: ["$pago.tipo", ["TDC", "TDB"]] }, { $eq: ["$pago.bancoDestino", "Banesco"] }] },
                      "$pago.monto",
                      0,
                    ],
                  },
                },
                totalTransferencia: { $sum: { $cond: [{ $eq: ["$pago.tipo", "TRANSFERENCIA"] }, "$pago.monto", 0] } },
              },
            },
            {
              // Limpiar el _id del resultado
              $project: { _id: 0 },
            },
          ],
        },
      },
    ]);

    // Extraer los resultados de $facet
    const orders = results[0].orders;
    // Si no hay pagos, paymentSummary será un array vacío. Devolvemos un objeto con ceros.
    const paymentSummary = results[0].paymentSummary[0] || {};

    res.send({ orders, paymentSummary });
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
