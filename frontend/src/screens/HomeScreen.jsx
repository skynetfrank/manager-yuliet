import { Link } from "react-router";
import { useSelector } from "react-redux";
import casheaimg from "../assets/cashea.jpg";
import logo2 from "../assets/logo2.png";
import CambioMarquee from "../components/CambioMarquee";
import {
  LucideBaggageClaim,
  LucideBoxes,
  LucideCalculator,
  LucideCalendarCheck,
  LucideCalendar,
  LucideChartNetwork,
  LucideClipboardCheck,
  LucideClockArrowDown,
  LucideExternalLink,
  LucideFilePlus,
  LucideFileInput,
  LucideFolderSearch,
  LucideLayoutDashboard,
  LucideListTodo,
  LucidePenTool,
  LucidePersonStanding,
  LucideStar,
  LucideTruck,
  LucideUsers,
} from "lucide-react";

// --- Data para las secciones del Dashboard ---

const salesSection = [
  { to: "/facturacion", icon: <LucideBaggageClaim />, label: "Venta Detal", isPrimary: true },
  { to: "/verpedidos", icon: <LucideListTodo />, label: "Lista de Ventas" },
  { to: "/verproductos", icon: <LucideBoxes />, label: "Catalogo" },
  { to: "/ventasdiarias", icon: <LucideCalendarCheck />, label: "Ventas Diarias" },
  { to: "/enconstruccion", icon: <LucideLayoutDashboard />, label: "Dashboard" },
];



// --- Componentes Reutilizables ---

const DashboardCard = ({ to, icon, label, isPrimary, isExternal, children }) => {
  const cardClasses = `home-card ${isPrimary ? "primary" : ""}`;

  const content = (
    <>
      {icon}
      {children}
      <span>{label}</span>
      {isExternal && <LucideExternalLink className="external-link-icon" />}
    </>
  );

  if (isExternal) {
    return (
      <a href={to} rel="noopener noreferrer" target="_blank" className={cardClasses}>
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={cardClasses}>
      {content}
    </Link>
  );
};

const DashboardSection = ({ title, cards }) => (
  <section className="dashboard-section">
    <h2 className="section-title">{title}</h2>
    <div className="section-grid">
      {cards.map((card) => (
        <DashboardCard key={card.label} {...card} />
      ))}
    </div>
  </section>
);

function HomeScreen() {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  if (!userInfo) {
    return (
      <div className="not-userinfo">
        <img src={logo2} alt="fachada" />;
      </div>
    );
  }

  return (
    <>
      <CambioMarquee />
      <div className="dashboard-container">
        <DashboardSection title="Ventas y Pedidos" cards={salesSection} />

      </div>
    </>
  );
}

export default HomeScreen;
