import { useState } from "react";
import { useRegisterClienteMutation } from "../api/clientesApi";
import Swal from "sweetalert2";
import { LucideXSquare } from "lucide-react";

export default function ClientRegister({ identificacion, onRegisterSuccess, onCancel }) {
  const [registerCliente, { isLoading: isUpdating, isSuccess }] = useRegisterClienteMutation();
  const [rif] = useState(identificacion || "");
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    celular: "",
    email: "",
    canal: "",
  });

  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.nombre.trim()) newErrors.nombre = "El Nombre O Razon Social es requerido"; // Asegúrate de que la propiedad nombre esté en tu estado formDataFirst name is required';
    if (!formData.direccion.trim()) newErrors.direccion = "La Direccion es requerida";
    if (!formData.canal.trim()) newErrors.canal = "El Canal de Divulgacion es requerido"; // Asegúrate de que la propiedad direccion esté en tu estado formDataLast name is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Por favor ingrese una direccion de Email valida";
    }

    // celular validation (optional)
    if (formData.celular && !/^\d{10,15}$/.test(formData.celular.replace(/\D/g, ""))) {
      newErrors.celular = "Por favor ingrese su telefono en forma correcta";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await registerCliente({ ...formData, rif })
          .unwrap()
          .then((payload) => {
            Swal.fire("Agregado", "Cliente registrado exitosamente", "success");
            // Reset form
            setFormData({
              nombre: "",
              direccion: "",
              email: "",
              celular: "",
              canal: "",
            });
            onRegisterSuccess(payload);
          })
          .catch((error) => {
            Swal.fire("Error", "Ocurrio un Error", "error");
          });
      } catch (err) {
        Swal.fire("Error", err.data?.message || "Failed to register client", "error");
      }
    }
  };

  return (
    <div className="form-container">
      <div className="modal-close-container">
        <LucideXSquare className="close-icon light" onClick={onCancel} />
        <p>RIF / CEDULA: {rif}</p>
      </div>
      <form onSubmit={handleSubmit} className="form">
        {/* Personal Information */}
        <div className="form-section">
          <h3>Registrar Cliente</h3>

          <div className="form-group">
            <label htmlFor="nombre">Nombre o Razon Social *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? "error" : ""}
              placeholder="Ingrese su Nombre o Razon Social" //Enter your first name"
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Direccion *</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={errors.direccion ? "error" : ""}
              placeholder="Enter your last name"
            />
            {errors.direccion && <span className="error-message">{errors.direccion}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="celular">Telefono</label>
              <input
                type="tel"
                id="celular"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                className={errors.celular ? "error" : ""}
                placeholder="Ej: 0412-999-9999"
              />
              {errors.celular && <span className="error-message">{errors.celular}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                placeholder="Ingrese su email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gender">Como se entero de nosotros</label>
            <select id="canal" name="canal" value={formData.canal} onChange={handleChange}>
              <option value="">Selecionar</option>
              <option value="INICIATIVA">INICIATIVA</option>
              <option value="RECOMENDADO">RECOMENDADO</option>
              <option value="INSTAGRAM">INSTAGRAM</option>
              <option value="TIKTOK">TIKTOK</option>
              <option value="FACEBOOK">FACEBOOK</option>
            </select>
          </div>
        </div>
        <button type="submit" className="submit-button">
          Registrar Cliente
        </button>
      </form>
    </div>
  );
}
