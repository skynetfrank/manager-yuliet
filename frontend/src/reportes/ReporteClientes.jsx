import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { LucideEdit, LucideTrash2, LucidePlusCircle, LucideUser, LucideSearch } from "lucide-react";
import { useGetClientesQuery, useDeleteClienteMutation } from "../api/clientesApi";
import Loader from "../components/Loader";
import Swal from "sweetalert2";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="tankstack-pagination-container">
      <div className="tankstack-pagination-botonera">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
}

function ReporteClientes() {
  const navigate = useNavigate("");
  const { data: clientes, isLoading, isError, error } = useGetClientesQuery();
  const [deleteCliente, { isLoading: isDeleting }] = useDeleteClienteMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const filteredClientes = useMemo(() => {
    if (!clientes) return [];
    return clientes.filter(
      (cliente) =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.rif.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clientes, searchTerm]);

  // Lógica de paginación
  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE);
  const currentClientes = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredClientes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredClientes, currentPage, ITEMS_PER_PAGE]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página en cada búsqueda
  };

  const deleteHandler = (id, nombre) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar a ${nombre}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCliente(id).unwrap();
          Swal.fire("Eliminado", "El cliente ha sido eliminado.", "success");
        } catch (err) {
          Swal.fire("Error", "No se pudo eliminar el cliente.", "error");
        }
      }
    });
  };

  if (isLoading) {
    return <Loader txt="Cargando clientes..." />;
  }

  if (isError) {
    return <div className="error-message">Error al cargar los clientes: {error.message}</div>;
  }

  return (
    <div className="client-report-container">
      <div className="client-report-header">
        <h2 className="section-title">Directorio de Clientes</h2>
        <div className="client-report-actions">
          <div className="search-box">
            <LucideSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o RIF..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button className="add-client-btn" onClick={() => navigate("/cliente/nuevo")}>
            <LucidePlusCircle size={20} />
            <span>Crear Cliente</span>
          </button>
        </div>
      </div>

      <div className="client-grid">
        {currentClientes.map((cliente, index) => (
          <div key={cliente._id} className="client-card" style={{ animationDelay: `${index * 40}ms` }}>
            <div className="client-card-header">
              <div className="client-avatar">
                <LucideUser size={24} />
              </div>
              <div className="client-info">
                <h3 className="client-name">{cliente.nombre}</h3>
                <p className="client-rif">RIF/CI: {cliente.rif}</p>
              </div>
            </div>
            <div className="client-card-body">
              <p>
                <strong>Teléfono:</strong> {cliente.celular || "N/A"}
              </p>
              <p>
                <strong>Dirección:</strong> {cliente.direccion || "N/A"}
              </p>
            </div>
            <div className="client-card-footer">
              <span className="client-date">Creado: {dayjs(cliente.timestamp).format("DD/MM/YYYY")}</span>
              <div className="client-card-actions">
                <button
                  className="icon-btn edit-btn"
                  onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
                  title="Editar Cliente"
                >
                  <LucideEdit size={18} />
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() => deleteHandler(cliente._id, cliente.nombre)}
                  disabled={isDeleting}
                  title="Eliminar Cliente"
                >
                  <LucideTrash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredClientes.length === 0 && !isLoading && (
        <div className="empty-state">
          <LucideUser size={48} />
          <p>
            {searchTerm ? "No se encontraron clientes que coincidan con la búsqueda." : "No hay clientes registrados."}
          </p>
        </div>
      )}

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  );
}

export default ReporteClientes;
