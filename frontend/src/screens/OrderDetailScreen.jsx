import { useParams, Link } from "react-router";
import { useGetOrderQuery } from "../api/ordersApi";
import Loader from "../components/Loader";
import dayjs from "dayjs";
import {
  LucideAlertCircle,
  LucideArrowLeft,
  LucideUser,
  LucideMail,
  LucidePhone,
  LucideMapPin,
  LucideCheckCircle,
  LucideXCircle,
  LucideFileText,
} from "lucide-react";
import logo from "../assets/logo2.png";

function OrderDetailScreen() {
  const { id: orderId } = useParams();
  const { data: order, isLoading, isError, error } = useGetOrderQuery(orderId);

  if (isLoading) {
    return <Loader txt="Cargando detalles de la orden..." />;
  }

  if (isError) {
    return (
      <div className="empty-state">
        <LucideAlertCircle size={48} color="#dc3545" />
        <h2 style={{ color: "#dc3545" }}>Error al Cargar la Orden</h2>
        <p>{error?.data?.message || "No se pudo encontrar la orden especificada."}</p>
        <Link to="/verpedidos" className="back-button-error">
          <LucideArrowLeft size={18} /> Volver al listado
        </Link>
      </div>
    );
  }

  const {
    orderItems,
    subtotal,
    iva,
    totalVenta,
    delivery,
    clienteInfo,
    createdAt,
    pago, // Array con los detalles de pago
  } = order;
  console.log("order", order);
  return (
    <div className="order-detail-container">
      <div className="invoice-header">
        <img src={logo} alt="Logo de la Tienda" className="invoice-logo" />
        <div className="store-details">
          <h2>DEMODA</h2>
          <p>RIF: J-50151733-9</p>
          <p>Edif. Los Frailes, Piso 6. Chuao. Caracas</p>
          <p>Teléfono: (0412) 611-3970</p>
        </div>
      </div>
      <div className="order-detail-header">
        <h1>
          Orden <span>...{order._id.substring(order._id.length - 6)}</span>
        </h1>
        <p className="order-date">Fecha: {dayjs(createdAt).format("DD/MM/YYYY")}</p>
        <Link to="/verpedidos" className="back-button">
          <LucideArrowLeft size={18} />
          <span>Volver al listado</span>
        </Link>
      </div>


      <div className="order-detail-grid">
        {/* Columna Izquierda - Items y Pagos */}
        <div className="order-detail-main">
          <div className="detail-card">
            <h2 className="detail-card-title">Cliente</h2>
            <div className="client-details-list">
              <p>
                <LucideUser size={16} /> <strong>{clienteInfo.nombre}</strong>
              </p>
              <p>
                <LucideFileText size={16} /> RIF/CI: {clienteInfo.rif}
              </p>
              <p>
                <LucideMail size={16} /> <a href={`mailto:${clienteInfo.email}`}>{clienteInfo.email || "N/A"}</a>
              </p>
              <p>
                <LucidePhone size={16} /> {clienteInfo.celular || "N/A"}
              </p>
              <p>
                <LucideMapPin size={16} /> {clienteInfo.direccion || "N/A"}
              </p>
            </div>
          </div>
          <div className="detail-card">
            <h2 className="detail-card-title">Artículos del Pedido</h2>
            <div className="order-items-list-detail">
              {orderItems.map((item) => (
                <div key={item._id} className="order-item-detail">
                  <img src={item.imageurl} alt={item.nombre} className="order-item-image-detail" />
                  <div className="order-item-info-detail">
                    <p className="item-name">{item.marca}</p>
                    <p className="item-meta">
                      {item.qty} x ${item.precio.toFixed(2)}
                    </p>
                  </div>
                  <p className="order-item-total-detail">${(item.qty * item.precio).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Columna Derecha - Cliente, Resumen y Estado */}
        <div className="order-detail-sidebar">


          <div className="detail-card">
            <h2 className="detail-card-title">Resumen del Pedido</h2>
            <div className="summary-list">
              <div className="summary-row-detail">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row-detail">
                <span>Envío</span>
                <span>${delivery.toFixed(2)}</span>
              </div>
              <div className="summary-row-detail">
                <span>IVA</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <div className="summary-row-detail total">
                <span>Total</span>
                <span>${totalVenta.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h2 className="detail-card-title">Estado del Pago</h2>
            {pago?.length > 0 ? (
              <div className="payment-details-list">
                {pago.map((p, index) => (
                  <div key={index} className="status-box paid">
                    <LucideCheckCircle size={20} />
                    <div>
                      <p className="status-title">
                        {p.tipo}: ${p.monto.toFixed(2)}
                      </p>
                      <p className="status-text">Realizado el {dayjs(p.fecha).format("DD/MM/YYYY")}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="status-box pending">
                <LucideXCircle size={20} />
                <div>
                  <p className="status-title">Estado del Pago</p>
                  <p className="status-text">Pendiente de Pago</p>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}

export default OrderDetailScreen;
