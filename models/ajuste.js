import mongoose from "mongoose";

const ajusteSchema = new mongoose.Schema(
  {
    fecha: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sucursal: { type: String },
    tipo: { type: String },
    orderItems: [
      {
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        codigo: { type: String, required: true },
        marca: { type: String },
        modelo: { type: String },
        talla: { type: String },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
        imageurl: { type: String, required: true },
        causa: { type: String },
        tipoAjuste: { type: String },
        memo: { type: String },
      },
    ],
    totalItems: { type: Number },
    totalUnidades: { type: Number },
    searchstring: { type: String },
  },
  {
    timestamps: true,
  }
);
const Ajuste = mongoose.model("Ajuste", ajusteSchema);
export default Ajuste;
