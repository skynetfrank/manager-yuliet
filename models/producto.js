import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    codigo: { type: String, unique: true },
    etiquetas: [],
    contenedor: { type: Number },
    categoria: { type: String },
    ubicacion: { type: String },
    marca: { type: String },
    modelo: { type: String },
    color: { type: String },
    genero: { type: String },
    descripcion: { type: String },
    existencia: { type: Number, default: 0 },
    tallas: {},
    costousd: { type: Number, default: 0 },
    preciousd: { type: Number, default: 0 },
    cambiodia: { type: Number, default: 0 },
    imageurl: { type: String },
    visible: { type: Boolean, default: true },
    tipo: { type: String },
    isPromocion: { type: Boolean, default: false },
    isInstagram: { type: Boolean, default: false },
    textopromocion: { type: String },
    searchstring: { type: String },
  },
  {
    timestamps: true,
  }
);
const Producto = mongoose.model("Producto", productoSchema);

export default Producto;
