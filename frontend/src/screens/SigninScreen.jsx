import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import { signin } from "../actions/userActions";
import { useNavigate } from "react-router";
import { USER_SIGNIN_RESET } from "../constants/userConstants";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import logo from "../assets/logo.png";

export default function SigninScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo, loading, error } = userSignin;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // Limpia el mensaje de error después de unos segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch({ type: USER_SIGNIN_RESET });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error]);

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={submitHandler}>
        <img src={logo} alt="Logo" className="signin-logo" />
        <h2>Iniciar Sesión</h2>

        <div className="input-group">
          <Mail className="input-icon" />
          <input
            type="email"
            placeholder="Ingrese su Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <Lock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Ingrese su Clave"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {error && <p className="signin-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? <div className="spinner"></div> : <LogIn />}
            <span>{loading ? "Verificando..." : "Entrar"}</span>
          </button>
        </div>

        <div className="signin-footer">
          <Link to={`/register?redirect=${redirect}`}>Crear Cuenta</Link>
        </div>
      </form>
    </div>
  );
}
