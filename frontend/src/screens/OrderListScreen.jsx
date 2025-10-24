import { useState, useMemo } from "react";
import { useGetOrdersQuery } from "../api/ordersApi";
import Loader from "../components/Loader";
import { Link } from "react-router";
import dayjs from "dayjs";
import {
  LucideEye,
  LucideAlertCircle,
  LucideListOrdered,
  LucideSearch,
  LucideX,
  LucideArrowDown,
  LucideArrowUp,
} from "lucide-react";
import Tooltip from "../components/Tooltip";
import Pagination from "../components/Pagination";

function OrderListScreen() {
  const { data: orders, isLoading, isError, error } = useGetOrdersQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15); // Puedes ajustar este número
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "fecha", direction: "descending" });

  // Lógica de ordenación
  const sortedOrders = useMemo(() => {
    let sortableItems = orders ? [...orders] : [];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const valA = sortConfig.key === "cliente" ? a.clienteInfo?.nombre : a[sortConfig.key];
        const valB = sortConfig.key === "cliente" ? b.clienteInfo?.nombre : b[sortConfig.key];

        if (valA < valB) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [orders, sortConfig]);

  if (isLoading) {
    return <Loader txt="Cargando órdenes..." />;
  }

  if (isError) {
    return (
      <div className="empty-state">
        <LucideAlertCircle size={48} color="#dc3545" />
        <h2 style={{ color: "#dc3545" }}>Error al Cargar Órdenes</h2>
        <p>{error?.data?.message || error.error}</p>
      </div>
    );
  }

  // Lógica de filtrado y paginación en el cliente
  const filteredOrders = sortedOrders
    ? sortedOrders.filter((order) => {
        const orderDate = dayjs(order.fecha);
        const clientNameMatch = order.clienteInfo?.nombre.toLowerCase().includes(searchTerm.toLowerCase());

        const startDateMatch = startDate
          ? orderDate.isAfter(dayjs(startDate).startOf("day").subtract(1, "second"))
          : true;
        const endDateMatch = endDate ? orderDate.isBefore(dayjs(endDate).endOf("day")) : true;

        return clientNameMatch && startDateMatch && endDateMatch;
      })
    : [];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página con cada búsqueda
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
    setSortConfig({ key: "fecha", direction: "descending" }); // Resetea al orden inicial
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Resetear a la primera página con cada cambio de orden
  };
  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <h1 className="section-title">Historial de Órdenes</h1>
        <div className="filters-container">
          <div className="date-filter-container">
            <label htmlFor="startDate">Desde:</label>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label htmlFor="endDate">Hasta:</label>
            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="search-input-container">
            <LucideSearch className="search-input-icon" />
            <input type="text" placeholder="Buscar por cliente..." value={searchTerm} onChange={handleSearchChange} />
          </div>
          <button onClick={clearFilters} className="clear-filters-btn">
            <LucideX size={16} /> Limpiar
          </button>
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <div className="table-responsive-container">
          <table className="order-list-table">
            <thead>
              <tr>
                <th className="sortable-header" onClick={() => requestSort("_id")}>
                  ID Orden{" "}
                  {sortConfig.key === "_id" &&
                    (sortConfig.direction === "ascending" ? (
                      <LucideArrowUp size={14} />
                    ) : (
                      <LucideArrowDown size={14} />
                    ))}
                </th>
                <th className="sortable-header" onClick={() => requestSort("fecha")}>
                  Fecha{" "}
                  {sortConfig.key === "fecha" &&
                    (sortConfig.direction === "ascending" ? (
                      <LucideArrowUp size={14} />
                    ) : (
                      <LucideArrowDown size={14} />
                    ))}
                </th>
                <th className="sortable-header" onClick={() => requestSort("cliente")}>
                  Cliente{" "}
                  {sortConfig.key === "cliente" &&
                    (sortConfig.direction === "ascending" ? (
                      <LucideArrowUp size={14} />
                    ) : (
                      <LucideArrowDown size={14} />
                    ))}
                </th>
                <th className="sortable-header" onClick={() => requestSort("totalVenta")}>
                  Total{" "}
                  {sortConfig.key === "totalVenta" &&
                    (sortConfig.direction === "ascending" ? (
                      <LucideArrowUp size={14} />
                    ) : (
                      <LucideArrowDown size={14} />
                    ))}
                </th>
                <th>Pagado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id}>
                  <td>...{order._id.substring(order._id.length - 6)}</td>
                  <td>{dayjs(order.fecha).format("DD/MM/YYYY")}</td>
                  <td>{order.clienteInfo?.nombre.toUpperCase()}</td>
                  <td className="total-amount">${order?.totalVenta?.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.isPaid ? "status-paid" : "status-pending"}`}>
                      {order.isPaid ? "Pagado" : "Pendiente"}
                    </span>
                  </td>

                  <td>
                    <Tooltip text="Ver Detalles">
                      <Link to={`/order/${order._id}`} className="action-btn">
                        <LucideEye size={20} />
                      </Link>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length > 0 ? (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          ) : (
            <p className="no-results-message">No se encontraron órdenes que coincidan con la búsqueda.</p>
          )}
        </div>
      ) : (
        <div className="empty-state">
          <LucideListOrdered size={48} />
          <p>Aún no se han registrado órdenes.</p>
        </div>
      )}
    </div>
  );
}

export default OrderListScreen;
