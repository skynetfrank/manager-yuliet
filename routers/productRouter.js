import express from "express";
import expressAsyncHandler from "express-async-handler";
import Producto from "../models/producto.js";
import { isAdmin, isAuth } from "../utils.js";
import mongoose from "mongoose";

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const productos = await Producto.find(
      {},
      {
        _id: 1,
        codigo: 1,
        categoria: 1,
        preciousd: 1,
        marca: 1,
        modelo: 1,
        color: 1,
        genero: 1,
        tallas: 1,
        imageurl: 1,
        existencia: 1,
      }
    ).sort({
      codigo: 1,
    });

    res.send(productos);
  })
);

productRouter.get(
  "/buscarporcodigo/:id",
  expressAsyncHandler(async (req, res) => {
    const producto = await Producto.find(
      { codigo: req.params.id },
      {
        nombre: 1,
        codigo: 1,
        marca: 1,
        imageurl: 1,
        preciousd: 1,
        _id: 1,
        tallas: 1,
        modelo: 1,
      }
    );

    if (producto) {
      res.send(producto);
    } else {
      res.status(404).send({ message: "Producto No Existe" });
    }
  })
);

productRouter.get(
  "/distribucion",
  expressAsyncHandler(async (req, res) => {
    // Usamos $facet para ejecutar múltiples pipelines de agregación en una sola consulta.
    // Esto es mucho más eficiente que hacer 8 llamadas separadas a la base de datos.
    const results = await Producto.aggregate([
      {
        $facet: {
          // Pipeline 1: Agrupar por categoría
          categorias: [
            {
              $group: {
                _id: "$categoria",
                unidades: { $sum: "$existencia" },
              },
            },
          ],
          // Pipeline 2: Agrupar por prefijos de código
          distribucion: [
            {
              $group: {
                _id: null, // Agrupamos todos los documentos en uno solo
                // Usamos $cond para sumar condicionalmente basado en el regex del código
                DM: {
                  $sum: {
                    $cond: [{ $regexMatch: { input: "$codigo", regex: "DM-", options: "i" } }, "$existencia", 0],
                  },
                },
                DM2: {
                  $sum: {
                    $cond: [{ $regexMatch: { input: "$codigo", regex: "DM2", options: "i" } }, "$existencia", 0],
                  },
                },
                DM3: {
                  $sum: {
                    $cond: [{ $regexMatch: { input: "$codigo", regex: "DM3-", options: "i" } }, "$existencia", 0],
                  },
                },
                AG: {
                  $sum: {
                    $cond: [{ $regexMatch: { input: "$codigo", regex: "AG-", options: "i" } }, "$existencia", 0],
                  },
                },
                AG3: {
                  $sum: {
                    $cond: [{ $regexMatch: { input: "$codigo", regex: "AG3-", options: "i" } }, "$existencia", 0],
                  },
                },
                XZ: {
                  $sum: {
                    $cond: [{ $regexMatch: { input: "$codigo", regex: "XZ-", options: "i" } }, "$existencia", 0],
                  },
                },
                genericos: {
                  $sum: { $cond: [{ $regexMatch: { input: "$codigo", regex: "A-", options: "i" } }, "$existencia", 0] },
                },
              },
            },
            {
              $project: {
                // Eliminamos el campo _id del resultado final
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    // El resultado de $facet es un array con un objeto que contiene las claves 'categorias' y 'distribucion'.
    // Extraemos los datos para enviarlos en el formato que el frontend espera.
    const categorias = results[0].categorias;
    // 'distribucion' será un array con un solo objeto, o un array vacío si no hay productos.
    const distribucion = results[0].distribucion[0] || {
      DM: 0,
      DM2: 0,
      DM3: 0,
      AG: 0,
      AG3: 0,
      XZ: 0,
      genericos: 0,
    };

    res.send({
      categorias,
      distribucion,
    });
  })
);

productRouter.get(
  "/cargarinventario",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const db = mongoose.connection.useDb("dmchacao1db");

    const ProductoChacao = db.model("Producto", Producto.schema);

    for await (const doc of Inventario.find({ existencia: { $gt: 0 } })) {
      const prod = await ProductoChacao.findOne({ codigo: doc.codigo });

      if (prod) {
        const sizes = prod.tallas;
        const newStock = prod.existencia + doc.existencia;

        //crear nuevo objeto con la suma de las tallas de la db y el producto iterado
        //en la consulta for of
        const updatedTallas = Object.keys(sizes).reduce(function (obj, k) {
          obj[k] = (obj[k] || 0) + sizes[k];
          return obj;
        }, Object.assign({}, doc.tallas));

        const updatedProductStock = await ProductoChacao.findOneAndUpdate(
          { codigo: doc.codigo },
          {
            existencia: newStock,
            tallas: updatedTallas,
          }
        );
      }
    }
    res.status(201).send({
      message: "Inventario Cargado en Tienda chacao!",
    });
  })
);

productRouter.get(
  "/all",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const myStock = await Producto.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$existencia" },
        },
      },
    ]);

    const myStockDM3 = await Producto.aggregate([
      {
        $match: {
          codigo: { $regex: "DM3", $options: "i" },
        },
      },
      {
        $group: {
          _id: null,
          totalStockDM3: { $sum: "$existencia" },
        },
      },
    ]);

    const myStockAG3 = await Producto.aggregate([
      {
        $match: {
          codigo: { $regex: "AG3", $options: "i" },
        },
      },
      {
        $group: {
          _id: null,
          totalStockAG3: { $sum: "$existencia" },
        },
      },
    ]);

    const myStockDM2 = await Producto.aggregate([
      {
        $match: {
          codigo: { $regex: "DM2", $options: "i" },
        },
      },
      {
        $group: {
          _id: null,
          totalStockDM2: { $sum: "$existencia" },
        },
      },
    ]);

    const myStockAG = await Producto.aggregate([
      {
        $match: {
          codigo: { $regex: "AG-", $options: "i" },
        },
      },
      {
        $group: {
          _id: null,
          totalStockAG: { $sum: "$existencia" },
        },
      },
    ]);

    const myStockXZ = await Producto.aggregate([
      {
        $match: {
          codigo: { $regex: "XZ-", $options: "i" },
        },
      },
      {
        $group: {
          _id: null,
          totalStockXZ: { $sum: "$existencia" },
        },
      },
    ]);

    const myStockA = await Producto.aggregate([
      {
        $match: {
          codigo: { $regex: "A-", $options: "i" },
        },
      },
      {
        $group: {
          _id: null,
          totalStockA: { $sum: "$existencia" },
        },
      },
    ]);

    const myStockDM = await Producto.aggregate([
      {
        $match: {
          codigo: { $regex: "DM-", $options: "i" },
        },
      },
      {
        $group: {
          _id: null,
          totalStockDM: { $sum: "$existencia" },
        },
      },
    ]);

    const productos = await Producto.aggregate([
      {
        $project: {
          _id: 1,
          codigo: 1,
          marca: 1,
          existencia: 1,
          categoria: 1,
          preciousd: 1,
          tallas: 1,
          imageurl: 1,
          totalvalor: { $multiply: ["$preciousd", "$existencia"] },
        },
      },
    ]).sort({ codigo: 1 });
    res.send({
      productos,
      myStock,
      myStockAG,
      myStockAG3,
      myStockDM2,
      myStockDM3,
      myStockXZ,
      myStockXZ3,
      myStockA,
      myStockDM,
    });
  })
);

productRouter.post(
  "/create",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const producto = new Producto({
      codigo: req.body.codigo,
      categoria: req.body.categoria,
      ubicacion: req.body.ubicacion,
      marca: req.body.marca,
      modelo: req.body.modelo,
      color: req.body.color,
      genero: req.body.genero,
      descripcion: req.body.descripcion.concat(
        " ",
        req.body.marca,
        " ",
        req.body.modelo,
        " ",
        req.body.genero,
        " ",
        req.body.color
      ),
      existencia: req.body.existencia,
      tallas: req.body.tallas,
      costousd: req.body.costousd,
      preciousd: req.body.preciousd,
      cambiodia: req.body.cambiodia,
      imageurl: req.body.imageurl,
      tipo: req.body.tipo,
      isPromocion: req.body.isPromocion,
      isInstagram: req.body.isInstagram,
      textopromocion: req.body.textopromocion,
      visible: req.body.visible,
      searchstring: req.body.codigo.concat(
        " ",
        req.body.marca,
        " ",
        req.body.modelo,
        " ",
        req.body.genero,
        " ",
        req.body.categoria,
        " ",
        req.body.color,
        " ",
        req.body.preciousd,
        " ",
        req.body.ubicacion
      ),
    });
    const createdProduct = await producto.save();

    res.send({
      _id: createdProduct._id,
      codigo: createdProduct.codigo,
      categoria: createdProduct.categoria,
      ubicacion: createdProduct.ubicacion,
      marca: createdProduct.marca,
      modelo: createdProduct.modelo,
      color: createdProduct.color,
      genero: createdProduct.genero,
      descripcion: createdProduct.descripcion,
      existencia: createdProduct.existencia,
      tallas: createdProduct.tallas,
      costousd: createdProduct.costousd,
      preciousd: createdProduct.preciousd,
      cambiodia: createdProduct.cambiodia,
      imageurl: createdProduct.imageurl,
      tipo: createdProduct.tipo,
      isPromocion: createdProduct.isPromocion,
      isInstagram: createdProduct.isInstagram,
      textopromocion: createdProduct.textopromocion,
      visible: createdProduct.visible,
    });
  })
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const producto = await Producto.findById(req.params.id, {});

    if (producto) {
      res.send(producto);
    } else {
      res.status(404).send({ message: "Producto No encontrado" });
    }
  })
);

productRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const producto = await Producto.findById(productId);
    let tallas = req.body.tallas;
    for (const property in tallas) {
      // console.log(`${property}: ${object[property]}`);
      if (tallas[property] === "" || tallas[property] === " ") {
        delete tallas[property];
      }
    }

    if (producto) {
      producto.categoria = req.body.categoria;
      producto.ubicacion = req.body.ubicacion;
      producto.marca = req.body.marca;
      producto.modelo = req.body.modelo;
      producto.color = req.body.color;
      producto.genero = req.body.genero;
      producto.descripcion = req.body.descripcion;
      producto.existencia = req.body.existencia;
      producto.tallas = req.body.tallas;
      producto.costousd = req.body.costousd;
      producto.preciousd = req.body.preciousd;
      producto.cambiodia = req.body.cambiodia;
      producto.imageurl = req.body.imageurl;
      producto.visible = req.body.visible;
      producto.tipo = req.body.tipo;
      producto.isPromocion = req.body.isPromocion;
      producto.isInstagram = req.body.isInstagram;
      producto.textopromocion = req.body.textopromocion;
      producto.searchstring = producto.codigo.concat(
        " ",
        req.body.marca,
        " ",
        req.body.modelo,
        " ",
        req.body.genero,
        " ",
        req.body.categoria,
        " ",
        req.body.preciousd,
        " ",
        req.body.ubicacion,
        " ",
        req.body.tipo
      );
      const updatedProduct = await producto.save();
      res.send({ message: "Producto Actualizado", producto: updatedProduct });
    } else {
      res.status(404).send({ message: "Producto no Encontrado" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      const deleteProduct = await producto.deleteOne();
      res.send({ message: "Producto Eliminado", product: deleteProduct });
    } else {
      res.status(404).send({ message: "Producto No Encontrado" });
    }
  })
);

export default productRouter;
