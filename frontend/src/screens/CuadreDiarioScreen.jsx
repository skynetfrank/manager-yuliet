import { useState } from "react";
import { useLazyGetCuadreDiarioQuery } from "../api/ordersApi";
import { LucideCalendarSearch, LucideLoader2, LucideAlertCircle, LucideChevronDown, LucideChevronRight } from "lucide-react";

// Helper para formatear la fecha a YYYY-MM-DD
const formatDateForApi = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

// Helper para formatear números como moneda
const formatCurrency = (value, currency = "USD") => {
    if (typeof value !== "number") value = 0;
    const options = {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    };
    // Usamos un locale que formatee como nos gusta (ej. en-US para $1,234.56)
    return new Intl.NumberFormat("en-US", options).format(value);
};

const CuadreDiarioScreen = () => {
    const [fecha, setFecha] = useState(formatDateForApi(new Date()));
    const [reportData, setReportData] = useState(null);
    const [showOrders, setShowOrders] = useState(false);

    const [triggerGetCuadre, { isLoading, isError, error }] = useLazyGetCuadreDiarioQuery();

    const handleGenerateReport = async () => {
        setShowOrders(false); // Ocultar detalles al generar nuevo reporte
        try {
            const reportResult = await triggerGetCuadre(fecha).unwrap();
            setReportData(reportResult);
        } catch (err) {
            console.error("Error al generar el reporte:", err);
            setReportData(null);
        }
    };

    // Calcula el total de ventas sumando los totales de cada orden
    const totalVentasDia = reportData?.orders?.reduce((acc, order) => acc + order.totalVenta, 0) || 0;

    // Mapeo de claves del resumen de pagos a etiquetas legibles
    const paymentLabels = {
        totalDolares: "Efectivo (USD)",
        totalEuros: "Efectivo (EUR)",
        totalBolivares: "Efectivo (Bs.)",
        totalZelle: "Zelle",
        totalPagoMovil: "Pago Móvil",
        totalPuntoBanesco: "Punto (Banesco)",
        totalPuntoPlaza: "Punto (Plaza)",
        totalPuntoVenezuela: "Punto (Venezuela)",
        totalTransferencia: "Transferencia",
        totalCashea: "Cashea",
    };

    return (
        <div className="cuadre-diario-container">
            <header className="cuadre-header">
                <LucideCalendarSearch size={32} />
                <h1>Cuadre Diario de Ventas</h1>
            </header>

            <div className="cuadre-controls">
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="date-input"
                />
                <button onClick={handleGenerateReport} disabled={isLoading} className="btn-generate">
                    {isLoading ? <LucideLoader2 className="animate-spin" /> : "Generar Reporte"}
                </button>
            </div>

            {isError && (
                <div className="cuadre-error">
                    <LucideAlertCircle />
                    <p>Error al cargar el reporte: {error?.data?.message || "Error de conexión"}</p>
                </div>
            )}

            {reportData && (
                <div className="report-content">
                    <h2>Reporte del día: {new Date(fecha + "T00:00:00").toLocaleDateString("es-VE")}</h2>

                    {reportData.orders.length === 0 ? (
                        <p className="no-data-message">No se encontraron ventas para esta fecha.</p>
                    ) : (
                        <>
                            <div className="report-summary-grid">
                                {/* Total de Ventas */}
                                <div className="summary-card total-ventas">
                                    <h3>Total Ventas del Día</h3>
                                    <p>{formatCurrency(totalVentasDia)}</p>
                                </div>

                                {/* Resumen de Pagos */}
                                <div className="summary-card payment-summary">
                                    <h3>Resumen de Pagos Recibidos</h3>
                                    <ul>
                                        {Object.entries(reportData.paymentSummary)
                                            .filter(([, value]) => value > 0) // Solo mostrar métodos con monto > 0
                                            .map(([key, value]) => (
                                                <li key={key}>
                                                    <span>{paymentLabels[key] || key}</span>
                                                    <strong>{formatCurrency(value)}</strong>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Detalle de Órdenes (colapsable) */}
                            <div className="orders-details-container">
                                <div className="details-header" onClick={() => setShowOrders(!showOrders)}>
                                    {showOrders ? <LucideChevronDown /> : <LucideChevronRight />}
                                    <h3>
                                        Detalle de Órdenes ({reportData.orders.length})
                                    </h3>
                                </div>
                                {showOrders && (
                                    <div className="orders-list">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th># Orden</th>
                                                    <th>Cliente</th>
                                                    <th>Items</th>
                                                    <th>Total Venta</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.orders.map((order) => (
                                                    <tr key={order._id}>
                                                        <td>{order._id.substring(order._id.length - 6)}</td>
                                                        <td>{order.clienteInfo?.nombre || "N/A"}</td>
                                                        <td>{order.totalItems}</td>
                                                        <td>{formatCurrency(order.totalVenta)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CuadreDiarioScreen;
