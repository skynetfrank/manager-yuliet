import { useState, useMemo } from "react";
import { useGetVendedoresQuery } from "../api/usersApi";
import { LucideSearch } from "lucide-react";

const VendedorViewer = ({ isOpen, onClose, onSelectVendedor, selectedVendedorId }) => {
  const { data: vendedores, isLoading, isError } = useGetVendedoresQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredVendedores = useMemo(() => {
    if (!vendedores) return [];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return vendedores.filter(
      (vendedor) =>
        (vendedor.nombre?.toLowerCase() ?? "").includes(lowerCaseSearchTerm) ||
        (vendedor.apellido?.toLowerCase() ?? "").includes(lowerCaseSearchTerm) ||
        (vendedor.cedula?.toLowerCase() ?? "").includes(lowerCaseSearchTerm)
    );
  }, [vendedores, searchTerm]);

  if (!isOpen) return null;

  const handleRowClick = (vendedor) => {
    onSelectVendedor(vendedor);
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        style={{
          maxWidth: "600px",
          maxHeight: "80vh" /* Limita la altura al 90% de la pantalla */,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="modal-header">
          <h3>Seleccionar Vendedor</h3>
         
        </div>
        <div className="modal-body" style={{ overflowY: "auto" /* Permite scroll en el cuerpo */ }}>
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Filtrar por nombre, apellido o cédula..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading && <p>Cargando vendedores...</p>}
          {isError && <p>Error al cargar los vendedores.</p>}

          <div className="viewer-table-container">
            <table className="viewer-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cédula</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendedores.length > 0 ? (
                  filteredVendedores.map((vendedor) => (
                    <tr
                      key={vendedor._id}
                      onClick={() => handleRowClick(vendedor)}
                      className={`clickable-row ${vendedor._id === selectedVendedorId ? "active-row" : ""}`}
                    >
                      <td>{vendedor.nombre}</td>
                      <td>{vendedor.apellido}</td>
                      <td>{vendedor.cedula}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No se encontraron vendedores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendedorViewer;
