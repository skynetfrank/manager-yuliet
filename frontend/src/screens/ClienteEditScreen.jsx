import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { useGetClienteQuery, useRegisterClienteMutation, useUpdateClienteMutation } from "../api/clientesApi";
import { listaCanales } from "../constants/listas";
import Loader from "../components/Loader";
import { LucideUser, LucideMail, LucideBuilding, LucidePhone, LucideMapPin, LucideTv } from "lucide-react";

const initialState = {
  nombre: "",
  email: "",
  rif: "",
  direccion: "",
  celular: "",
  canal: "",
};

export default function ClienteEditScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: clienteId } = params;
  const isEditMode = Boolean(clienteId);

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const { data: cliente, isLoading: isLoadingCliente } = useGetClienteQuery(clienteId, {
    skip: !isEditMode,
  });

  const [registerCliente, { isLoading: isRegistering }] = useRegisterClienteMutation();
  const [updateCliente, { isLoading: isUpdating }] = useUpdateClienteMutation();

  useEffect(() => {
    if (isEditMode && cliente) {
      setFormData({
        nombre: cliente.nombre || "",
        email: cliente.email || "",
        rif: cliente.rif || "",
        direccion: cliente.direccion || "",
        celular: cliente.celular || "",
        canal: cliente.canal || "",
      });
    }
  }, [cliente, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.rif) newErrors.rif = "El RIF/CI es obligatorio.";
    else if (!/^[VJGjvgEPe]\d{6,9}$/i.test(formData.rif)) {
      newErrors.rif = "Formato de RIF/CI inválido (Ej: V-12345678, J-123456789).";
    }
    if (!formData.direccion) newErrors.direccion = "La dirección es obligatoria.";
    if (formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Dirección de email inválida.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        await updateCliente({ id: clienteId, ...formData }).unwrap();
        Swal.fire("¡Éxito!", "Cliente actualizado correctamente.", "success");
      } else {
        await registerCliente(formData).unwrap();
        Swal.fire("¡Éxito!", "Cliente registrado correctamente.", "success");
      }
      navigate("/reporteclientes");
    } catch (error) {
      Swal.fire("Error", error.data?.message || "No se pudo completar la operación.", "error");
    }
  };

  if (isLoadingCliente) return <Loader txt="Cargando datos del cliente..." />;

  const renderInput = (name, label, icon, config = {}, type = "text") => (
    <div className={`input-group ${config.fullWidth ? "full-width" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <div className="input-with-icon">
        {icon}
        <input id={name} name={name} type={type} value={formData[name]} onChange={handleInputChange} {...config} />
      </div>
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="form-container client-form">
      <form onSubmit={submitHandler}>
        <div className="form-header">
          <h2>{isEditMode ? "Editar Cliente" : "Registrar Nuevo Cliente"}</h2>
          <Link to="/reporteclientes" className="back-link">
            Volver al Directorio
          </Link>
        </div>

        <div className="form-body">
          {renderInput("nombre", "Nombre o Razón Social", <LucideUser />, { required: true, fullWidth: true })}
          {renderInput("rif", "RIF / Cédula", <LucideBuilding />, {
            required: true,
            placeholder: "Ej: V12345678",
          })}
          {renderInput("celular", "Teléfono Celular", <LucidePhone />)}
          {renderInput("direccion", "Dirección Fiscal", <LucideMapPin />, { required: true, fullWidth: true })}
          {renderInput("email", "Correo Electrónico", <LucideMail />, { type: "email", fullWidth: true })}

          <div className="input-group full-width">
            <label htmlFor="canal">Canal de Difusión</label>
            <div className="input-with-icon">
              <LucideTv />
              <select id="canal" name="canal" value={formData.canal} onChange={handleInputChange}>
                <option value="">-- Seleccione un canal --</option>
                {listaCanales.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={isRegistering || isUpdating}>
            {isRegistering || isUpdating ? "Guardando..." : isEditMode ? "Actualizar Cliente" : "Crear Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}
