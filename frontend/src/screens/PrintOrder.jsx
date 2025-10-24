import React from "react";
import { useParams, Link } from "react-router";
import { useGetOrderQuery } from "../api/ordersApi";
import { LucidePrinter, LucideArrowLeft } from "lucide-react";
import logo from "../assets/logo.png";

const PrintOrder = () => {
    const { id } = useParams();
    const { data: order, isLoading, isError, error } = useGetOrderQuery(id);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return <div className="loading-container">Cargando orden...</div>;
    }

    if (isError) {
        return (
            <div className="error-container">
                <h2>Error al cargar la orden</h2>
                <p>{error?.data?.message || error.error}</p>
                <Link to="/facturacion" className="back-link">
                    <LucideArrowLeft /> Volver
                </Link>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="error-container">
                <h2>No se encontró la orden</h2>
                <Link to="/facturacion" className="back-link">
                    <LucideArrowLeft /> Volver
                </Link>
            </div>
        );
    }

    const { fecha, clienteInfo, orderItems, subtotal, descuento, iva, delivery, totalVenta, _id: orderId, pago } = order;

    return (
        <div className="print-order-container">
            <div className="print-controls">
                <Link to="/facturacion" className="back-button">
                    <LucideArrowLeft /> Volver a Facturación
                </Link>
                <button onClick={handlePrint} className="print-button">
                    <LucidePrinter /> Imprimir
                </button>
            </div>

            <div className="invoice-paper">
                <header className="invoice-header">
                    <img src={logo} alt="Logo de la Tienda" className="invoice-logo" />
                    <div className="store-details">
                        <h2>DEMODA</h2>
                        <p>RIF: J-12345678-9</p>
                        <p>Dirección de la tienda</p>
                        <p>Teléfono: (0212) 555-1234</p>
                    </div>
                </header>

                <section className="order-info">
                    <div className="order-meta">
                        <h3>Orden de Venta</h3>
                        <p>
                            <strong>Nº:</strong> {orderId.slice(-6).toUpperCase()}
                        </p>
                        <p>
                            <strong>Fecha:</strong> {new Date(fecha).toLocaleDateString("es-VE")}
                        </p>
                    </div>
                    <div className="client-details">
                        <h3>Cliente</h3>
                        <p>
                            <strong>Nombre:</strong> {clienteInfo.nombre}
                        </p>
                        <p>
                            <strong>RIF/CI:</strong> {clienteInfo.rif}
                        </p>
                        <p>
                            <strong>Teléfono:</strong> {clienteInfo.telefono}
                        </p>
                    </div>
                </section>

                <section className="order-items">
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Cant.</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.codigo}</td>
                                    <td>
                                        {item.nombre} (Talla: {item.talla})
                                    </td>
                                    <td>{item.qty}</td>
                                    <td>${Number(item.precio).toFixed(2)}</td>
                                    <td>${(item.qty * item.precio).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="order-summary">
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${Number(subtotal).toFixed(2)}</span>
                        </div>
                        {descuento > 0 && (
                            <div className="summary-row">
                                <span>Descuento:</span>
                                <span>-${Number(descuento).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row">
                            <span>IVA (16%):</span>
                            <span>${Number(iva).toFixed(2)}</span>
                        </div>
                        {delivery > 0 && (
                            <div className="summary-row">
                                <span>Delivery:</span>
                                <span>${Number(delivery).toFixed(2)}</span>
                            </div>
                        )}
                        <div className="summary-row total">
                            <span>Total a Pagar:</span>
                            <span>${Number(totalVenta).toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                <footer className="invoice-footer">
                    <p>Gracias por su compra</p>
                </footer>
            </div>
        </div>
    );
};

export default PrintOrder;