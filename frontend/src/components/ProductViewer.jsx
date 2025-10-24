import React, { useState, useMemo } from "react";
import { useGetProductsQuery } from "../api/productosApi";
import Loader from "./Loader";
import { LucideX } from "lucide-react";

const ProductViewer = ({ isOpen, onClose }) => {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const lowercasedFilter = searchTerm.toLowerCase();
    return products.filter(
      (product) =>
        product.codigo.toLowerCase().includes(lowercasedFilter) ||
        product.marca.toLowerCase().includes(lowercasedFilter) ||
        (product.categoria && product.categoria.toLowerCase().includes(lowercasedFilter))
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (!isOpen) {
    return null;
  }

  const renderTallas = (tallas) => {
    console.log("tallas", tallas)
    if (!tallas || Object.keys(tallas).length === 0) {
      return "N/A";
    }
    return Object.entries(tallas)
      .filter(([, stock]) => stock > 0)
      .map(([talla, stock]) => talla + " : " + stock)
      .join(", ");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-viewer">
        <div className="modal-header">
          <h2>Visor de Productos</h2>
          <button onClick={onClose} className="close-button">
            <LucideX size={24} />
          </button>
        </div>
        <div className="modal-body">
          <div className="viewer-controls">
            <input
              type="text"
              placeholder="Filtrar por código, marca o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="viewer-search-input"
            />
          </div>
          {isLoading ? (
            <Loader txt="Cargando productos..." />
          ) : (
            <>
              <div className="table-responsive-container">
                <table className="viewer-table">
                  <thead>
                    <tr>
                      <th>Imagen</th>
                      <th>Código</th>
                      <th>Precio</th>
                      <th>Marca</th>
                      <th>Tallas Disp.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <img src={product.imageurl} alt={product.codigo} className="viewer-product-image" />
                        </td>
                        <td>{product.codigo}</td>
                        <td>${Number(product.preciousd).toFixed(2)}</td>
                        <td>{product.marca}</td>
                        <td>{renderTallas(product.tallas)}</td>
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

export default ProductViewer;