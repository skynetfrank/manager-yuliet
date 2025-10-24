import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendedor: { type: String },
    canal: { type: String },
    fecha: { type: Date },
    clienteInfo: {
      nombre: { type: String },
      rif: { type: String },
      direccion: { type: String },
      telefono: { type: String },
    },
    orderItems: [
      {
        codigo: { type: String, required: true },
        marca: { type: String },
        qty: { type: Number, required: true },
        talla: { type: String },
        imageurl: { type: String },
        precio: { type: Number, required: true },
        producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
      },
    ],
    cambioDia: { type: Number, default: 0 },
    totalItems: { type: Number, required: true },
    descuento: { type: Number, default: 0 },
    delivery: { type: Number, required: true },
    subtotal: { type: Number, default: 0 },
    iva: { type: Number, required: true },
    totalVenta: { type: Number, required: true },
    pago: [],
    condicion: { type: String },
    deliveryInfo: {
      empresaEnvio: { type: String },
      motorizado: { type: String },
      destinatario: { type: String },
      cedula: { type: String },
      telefono: { type: String },
      direccionEnvio: { type: String },
      memoDelivery: { type: String },
      origenVenta: { type: String },
    },
    memo: { type: String },
    searchstring: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
export default Order;
