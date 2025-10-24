import { useState, useEffect, useCallback } from "react";
import { useLazyGetProductByCodeQuery } from "../api/productosApi";
import { LucideChevronDown, LucideFootprints, LucideLoader, LucideXSquare } from "lucide-react";

const ProductSearch = ({ onProductFound, onCancel }) => {
  const [triggerProductSearch, { data: products, isLoading, isError }] = useLazyGetProductByCodeQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [activeTalla, setActiveTalla] = useState("");
  const [activeQuantity, setActiveQuantity] = useState(1);

  const debouncedSearch = useCallback(
    (value) => {
      if (value.trim() !== "" && value.length > 2) {
        triggerProductSearch(value);
      }
    },
    [triggerProductSearch]
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value.toUpperCase());
  };

  const handleProductExpand = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null); // Contrae si se hace clic en el mismo producto
    } else {
      setExpandedProductId(productId); // Expande el nuevo producto
      setActiveTalla(""); // Resetea las selecciones
      setActiveQuantity(1);
    }
  };

  const handleTallaChange = (e) => {
    setActiveTalla(e.target.value);
    setActiveQuantity(1); // Resetea la cantidad cuando la talla cambia
  };

  const handleQuantityChange = (e) => {
    setActiveQuantity(Number(e.target.value));
  };

  const handleAddProduct = (product) => {
    console.log("producto ", product);
    if (!activeTalla) {
      alert("Por favor, seleccione una talla.");
      return;
    }
    // Desestructuramos el objeto 'product' para separar la propiedad 'tallas'.
    // El resto de las propiedades se agrupan en un nuevo objeto 'productToSend'.
    const { nombre, tallas, _id: producto, preciousd: precio, ...productToSend } = product;

    // Enviamos el nuevo objeto sin 'tallas', pero con la talla y cantidad seleccionadas.
    onProductFound({ ...productToSend, talla: activeTalla, producto, precio, qty: activeQuantity });
  };

  return (
    <div className="responsive-top-margin">
      <div className="modal-close-container">
        <LucideXSquare className="close-icon light" onClick={onCancel} />
        <div className="cancel-div" onClick={onCancel}>
          Cancelar
        </div>
        <LucideFootprints />
      </div>
      <div className="product-search-container">
        <div className="form-group">
          <label htmlFor="product-search-input">Código de Producto</label>
          <input
            type="text"
            id="product-search-input"
            name="product-search"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Buscar producto..."
            autoFocus
          />
        </div>
        <div className="product-search-results">
          {isLoading && (
            <div className="loading-container">
              <LucideLoader className="animate-spin" /> Buscando...
            </div>
          )}
          {isError && <p className="error-message">Error al buscar productos.</p>}
          {products && products.length === 0 && searchTerm && !isLoading && <p>No se encontraron productos.</p>}
          {products && products.length > 0 && (
            <div>
              <ul className="product-search-list">
                {products.map((product) => (
                  <li key={product._id} className="product-search-item">
                    <div className="product-info-clickable" onClick={() => handleProductExpand(product._id)}>
                      <img src={product.imageurl} alt={product.nombre} width="50" className="product-search-image" />
                      <div className="product-search-info">
                        <p>{product.codigo}</p>
                        <p>
                          {product.marca} - {product.modelo}
                        </p>
                        <p>${Number(product.preciousd).toFixed(2)}</p>
                      </div>
                      <LucideChevronDown
                        className={`expand-icon ${expandedProductId === product._id ? "expanded" : ""}`}
                      />
                    </div>

                    <div className={`tallas-selector ${expandedProductId === product._id ? "expanded" : ""}`}>
                      <div className="form-group-inline">
                        <label htmlFor={`talla-select-${product._id}`}>Disponibilidad</label>
                        <select
                          className="w-70"
                          id={`talla-select-${product._id}`}
                          value={activeTalla}
                          onChange={handleTallaChange}
                        >
                          <option value="" disabled>
                            Talla
                          </option>
                          {Object.entries(product.tallas || {})
                            .filter(([, stock]) => stock > 0)
                            .map(([talla]) => (
                              <option key={talla} value={talla}>
                                {talla}
                              </option>
                            ))}
                        </select>
                      </div>

                      {activeTalla && product.tallas[activeTalla] > 0 && (
                        <div className="form-group-inline">
                          <label htmlFor={`quantity-select-${product._id}`}>Cantidad</label>
                          <select
                            id={`quantity-select-${product._id}`}
                            value={activeQuantity}
                            onChange={handleQuantityChange}
                          >
                            {Array.from({ length: product.tallas[activeTalla] }, (_, i) => i + 1).map((qty) => (
                              <option key={qty} value={qty}>
                                {qty}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <button
                        className="add-product-btn"
                        onClick={() => handleAddProduct(product)}
                        disabled={!activeTalla}
                      >
                        Agregar al Pedido
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
