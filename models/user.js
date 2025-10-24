import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    cedula: { type: String, required: false, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telefono: { type: String },
    isAdmin: { type: Boolean },
    isVendedor: { type: Boolean },
    isActivo: { type: Boolean },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
