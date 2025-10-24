import { Link, Outlet } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "./actions/userActions";
import logo from "./assets/logo2.png";
import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import SplashScreen from "./components/SplashScreen";
import { LucidePower, LucideShield, LucideUser, LucideChevronDown, LucideLogIn } from "lucide-react";

function App() {
  const [hoy] = useState(new Date());
  const userSignin = useSelector((state) => state.userSignin);
  const isSplashVisible = useSelector((state) => state.splash.isVisible);
  const { userInfo } = userSignin;
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const signoutHandler = () => {
    dispatch(signout());
    setMenuOpen(false);
  };

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  // Si la splash screen está visible, solo mostramos eso.
  if (isSplashVisible) {
    return <SplashScreen />;
  }
  return (
    <>
      <div className="grid-container">
        <header className="app-header">
          <div className="header-left">
            <Link to="/">
              <img className="img-logo" src={logo} alt="logo" />
            </Link>
            <div className="header-title-group">
              <h2 className="title-manager">YULIET-APP</h2>
              <span className="negrita font-1 header-date">
                caracas, {dayjs(hoy.toISOString()).format("DD-MM-YYYY")}
              </span>
            </div>
          </div>

          <div className="header-right">
            {userInfo ? (
              <div className="user-menu" ref={menuRef}>
                <button className="user-menu-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                  <span>{userInfo?.nombre && userInfo.nombre.substring(0, 10)}</span>
                  <LucideChevronDown size={16} className={`chevron-icon ${menuOpen ? "open" : ""}`} />
                </button>
                {menuOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      <LucideUser size={16} />
                      <span>Mi Perfil</span>
                    </Link>
                    {userInfo.isAdmin && (
                      <Link to="/admin-menu" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <LucideShield size={16} />
                        <span>Admin</span>
                      </Link>
                    )}
                    <button onClick={signoutHandler} className="dropdown-item signout">
                      <LucidePower size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="header-login-button">
                <LucideLogIn size={18} />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>&copy; {new Date().getFullYear()} D'moda-Manager. Todos los derechos reservados.</span>
        </footer>
      </div>
    </>
  );
}

export default App;
