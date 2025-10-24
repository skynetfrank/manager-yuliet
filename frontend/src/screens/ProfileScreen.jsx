import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { detailsUser, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import { User, Mail, Lock, Eye, EyeOff, Fingerprint, Phone, Save } from "lucide-react";

export default function ProfileScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(null);

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = userUpdateProfile;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
      dispatch(detailsUser(userInfo._id));
    } else {
      setNombre(user.nombre || " ");
      setEmail(user.email || " ");
      setApellido(user.apellido || " ");
      setCedula(user.cedula || " ");
      setTelefono(user.telefono || " ");
    }
  }, [dispatch, userInfo._id, user, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
    } else {
      setMessage(null);
      dispatch(
        updateUserProfile({
          userId: user._id,
          nombre,
          email,
          password,
          apellido,
          cedula,
          telefono,
        })
      );
    }
  };

  useEffect(() => {
    if (successUpdate) {
      Swal.fire({
        title: "Datos Actualizado con Exito!",
        text: "Editar Perfil",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, successUpdate]);

  useEffect(() => {
    if (errorUpdate) {
      Swal.fire({
        title: "error",
        text: "Editar Perfil",
        imageUrl: logo,
        imageWidth: 70,
        imageHeight: 70,
        imageAlt: "logo",
      });
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, errorUpdate]);

  useEffect(() => {
    if (error) {
      Swal.fire("Ocurrio un Error al Actualizar!", "", error);
      dispatch({ type: USER_UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error]);

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={submitHandler} style={{ gap: "1rem" }}>
        <img src={logo} alt="Logo" className="signin-logo" />
        <h2>Perfil de Usuario</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="input-group">
              <User className="input-icon" />
              <input
                id="nombre"
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="input-group">
              <User className="input-icon" />
              <input
                id="apellido"
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>
            <div className="input-group">
              <Mail className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nueva clave (opcional)"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar nueva clave"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <div className="input-group">
              <Fingerprint className="input-icon" />
              <input
                id="cedula"
                type="text"
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              />
            </div>
            <div className="input-group">
              <Phone className="input-icon" />
              <input
                id="telefono"
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            {(errorUpdate || message) && <p className="signin-error">{errorUpdate || message}</p>}

            <div className="form-actions">
              <button type="submit" className="signin-button" disabled={loadingUpdate}>
                {loadingUpdate ? <div className="spinner"></div> : <Save />}
                <span>{loadingUpdate ? "Actualizando..." : "Actualizar Perfil"}</span>
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
