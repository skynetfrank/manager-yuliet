import mongoose from "mongoose";

const reposicionSchema = new mongoose.Schema(
  {
    fecha: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sucursal: { type: String },
    tipo: { type: String },
    items: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: { type: Number },
        tallas: {},
      },
    ],
    totalUnidades: { type: Number },
    totalItems: { type: Number },
    procesado: { type: Boolean },
    searchstring: { type: String },
  },
  {
    timestamps: true,
  }
);
const Reposicion = mongoose.model("Reposicion", reposicionSchema);
export default Reposicion;
