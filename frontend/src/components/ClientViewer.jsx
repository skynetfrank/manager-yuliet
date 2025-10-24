import React, { useState, useMemo } from "react";
import { useGetClientesQuery } from "../api/clientesApi";
import Loader from "./Loader";
import { LucideX } from "lucide-react";

const ClientViewer = ({ isOpen, onClose, onSelectClient }) => {
  const { data: clients = [], isLoading } = useGetClientesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    const lowercasedFilter = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        client.nombre.toLowerCase().includes(lowercasedFilter) || client.rif.toLowerCase().includes(lowercasedFilter)
    );
  }, [clients, searchTerm]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const currentClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content-viewer">
        <div className="modal-header">
          <h2>Lista de Clientes</h2>
          <button onClick={onClose} className="close-button">
            <LucideX size={24} />
          </button>
        </div>
        <div className="modal-body">
          <div className="viewer-controls">
            <input
              type="text"
              placeholder="Filtrar por nombre o RIF/CI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="viewer-search-input"
            />
          </div>
          {isLoading ? (
            <Loader txt="Cargando clientes..." />
          ) : (
            <>
              <div className="table-responsive-container">
                <table className="viewer-table">
                  <thead>
                    <tr>
                      <th>Nombre / Razón Social</th>
                      <th>RIF / CI</th>
                      <th>Teléfono</th>
                      <th>Dirección</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentClients.map((client) => (
                      <tr key={client._id} onClick={() => onSelectClient(client)} style={{ cursor: "pointer" }}>
                        <td>{client?.nombre.toUpperCase()}</td>
                        <td>{client.rif}</td>
                        <td>{client.celular || "N/A"}</td>
                        <td>{client.direccion || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="viewer-pagination">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    Anterior
                  </button>
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientViewer;
