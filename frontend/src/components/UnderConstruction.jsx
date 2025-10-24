import { BadgeAlert, HardHat, ShieldAlert } from "lucide-react";
import { Link } from "react-router";

const underConstructionStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(100vh - 200px)", // Ajusta la altura para que no ocupe toda la pantalla y se vea el header/footer
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    margin: "1rem",
    padding: "2rem",
    color: "#495057",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginTop: "1rem",
  },
  text: {
    fontSize: "1.1rem",
    maxWidth: "500px",
    lineHeight: "1.6",
  },
};

export default function UnderConstruction() {
  return (
    <div style={underConstructionStyles.container}>
      <ShieldAlert size={64} color="#ffc107" />
      <h1 style={underConstructionStyles.title}>Se Necesita Credenciales de Administrador </h1>
      <p style={underConstructionStyles.text}>
        Este Modulo solo es visible por Administradores de D'MODA.
        <br />
        Ofrecemos disculpas por las molestias.
      </p>
      <Link to="/" className="header-login-button" style={{ marginTop: "2rem" }}>
        Volver al Inicio
      </Link>
    </div>
  );
}
