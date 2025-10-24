import { useEffect, useRef, useState } from "react";
import {
  LucidePlusCircle,
  LucideUserSearch,
  LucideTrash2,
  LucideShoppingBag,
  LucidePrinter,
  LucideView,
  CircleDollarSign,
  LucideUserPlus2,
  LucideUserSquare2,
  LucideUsers2,
  LucideUsersRound,
  LucideUserRoundSearch,
  LucideBoxSelect,
  LucideBoxes,
} from "lucide-react";
import { useFacturacion } from "../hooks/useFacturacion";
import logo from "../assets/logo.png";
import ModalsManager from "../components/ModalsManager";
import CambioMarquee from "../components/CambioMarquee";
import ProductViewer from "../components/ProductViewer";
import ClientViewer from "../components/ClientViewer";
import Swal from "sweetalert2";
import ClientSearch from "../components/ClientSearch"; // <-- 1. Importar ClientSearch
import VendedorViewer from "../components/VendedorViewer";
import Tooltip from "../components/Tooltip";

function Facturacion() {
  const {
    // Estados y valores
    fecha,
    cambioDia,
    rif,
    setRif,
    clienteInfo,
    setClienteInfo,
    vendedor,
    setVendedor,
    condicion,
    ordenItems,
    metodosPago,
    descuento,
    delivery,
    setDelivery,
    memo,
    setMemo,
    setOrdenItems,
    subtotal,
    impuesto,
    totalOrden,
    totalPagado,
    vendedores,
    isCreatingOrder,
    showNewClientModal,
    setShowNewClientModal,
    showProductSearchModal,
    setShowProductSearchModal,
    showProductViewerModal,
    setShowProductViewerModal,
    showClientViewerModal,
    setShowClientViewerModal,
    showMetodoPagoModal,
    setShowMetodoPagoModal,
    imagenAmpliadaUrl,
    setImagenAmpliadaUrl,
    // Funciones y manejadores de eventos
    handleCondicionChange,
    handleDescuentoChange,
    addItemToOrder,
    deleteItemFromOrder,
    handleOpenPagoModal,
    handleSavePagos,
    createOrderHandler,
  } = useFacturacion();

  // --- Estado local para el modal de Vendedor ---
  const [showVendedorViewerModal, setShowVendedorViewerModal] = useState(false);

  // --- 2. Implementación de la ref para ClientSearch ---
  const clientSearchRef = useRef(null);

  const handleClientFound = (client) => {
    setClienteInfo(client);
    Swal.close(); // Cierra cualquier alerta de SweetAlert que pueda quedar abierta
  };

  const handleNewClient = (identificacion) => {
    setRif(identificacion);
    setShowNewClientModal(true); // Abre el modal para crear un nuevo cliente
  };

  const handleSearchCancel = () => {
    console.log("Búsqueda de cliente cancelada.");
    // No se necesita hacer nada, el flujo se detiene.
  };
  // --- Fin de la implementación de la ref ---

  const selectedVendedor = vendedores?.find((v) => v._id === vendedor);

  // Efecto para limpiar los métodos de pago si la orden queda en cero.
  useEffect(() => {
    if (totalOrden === 0) {
      handleSavePagos([]);
    }
  }, [totalOrden, handleSavePagos]);

  const handleUpdateQuantity = (index, newQty) => {
    const updatedItems = [...ordenItems];
    const itemToUpdate = updatedItems[index];
    updatedItems[index] = { ...itemToUpdate, qty: newQty };
    setOrdenItems(updatedItems);
    Swal.fire(
      "Cantidad Actualizada",
      `<strong>${itemToUpdate.codigo} (Talla ${itemToUpdate.talla})</strong>.`,
      "success"
    );
  };

  const handleDeleteItem = (index, item) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el producto ${item.codigo} (Talla ${item.talla}) de la orden.`,

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItemFromOrder(index);
        Swal.fire("Producto Eliminado!", "success");
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const PrintHeader = () => (
    <div className="print-header-container">
      <img src={logo} alt="Logo Tienda" className="print-logo" />
      <div className="print-store-info" style={{ flexShrink: 0 }}>
        <h4>DEMODA</h4>
        <p>RIF: J-12345678-9</p>
        <p>Almacen Principal</p>
        <p>Facturacion Detal</p>
      </div>
    </div>
  );

  return (
    <div className="facturacion-container">
      {/* --- Cabecera solo para impresión --- */}
      <CambioMarquee />
      <PrintHeader />
      <div className="info-cliente" style={{ padding: "0.5rem 1rem", border: "1px solid #ccc" }}>
        <div className="order-header" style={{ justifyContent: "space-around" }}>
          <Tooltip text="Lista Clientes">
            <LucideUserRoundSearch className="add-product-icon border" size={36} onClick={() => setShowClientViewerModal(true)} />
          </Tooltip>
          <Tooltip text="Lista Productos">
            <LucideBoxes className="add-product-icon border" size={36} onClick={() => setShowProductViewerModal(true)} />
          </Tooltip>
        </div>
      </div>
      <div className={`info-cliente ${!clienteInfo ? "alerta-sin-cliente" : ""}`}>
        <div className="order-header">
          <h3>PEDIDO {new Date(fecha).toLocaleDateString("es-VE")}</h3>
          <div className="detail-item" onClick={(e) => e.stopPropagation()}>
            <select id="condicion-select" value={condicion} onChange={handleCondicionChange}>
              <option value="Contado">Contado</option>
              <option value="Credito">Crédito</option>
              <option value="Intercambio">Intercambio</option>
              <option value="Donacion">Donación</option>
            </select>
          </div>
          {ordenItems.length > 0 && <LucidePrinter className="add-product-icon print-button" onClick={handlePrint} />}
        </div>
        <details className="details-collapsible full-width">
          <summary className="details-summary">
            {" "}
            Cliente
            <Tooltip text="Buscar/Cambiar Cliente">
              <LucideUserPlus2
                width={20}
                className="add-product-icon"
                style={{ color: clienteInfo ? "green" : "#7c0505", marginLeft: "25px" }}
                onClick={(e) => {
                  e.preventDefault(); // Prevenir que el <details> se cierre/abra
                  clientSearchRef.current?.show(); // <-- 3. Llamar a la búsqueda a través de la ref
                }}
              />
            </Tooltip>
          </summary>

          {clienteInfo && (
            <div className="client-order-details">
              <div className="detail-item">
                <span className="detail-label">Nombre o Razon Social</span>
                <span className="detail-value">{clienteInfo.nombre}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Teléfono</span>
                <span className="detail-value">{clienteInfo.celular}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">Dirección</span>
                <span className="detail-value">{clienteInfo.direccion}</span>
              </div>
            </div>
          )}
        </details>
        <details className="details-collapsible full-width">
          <summary className="details-summary">
            Vendedor{" "}
            <Tooltip text="Asignar Vendedor">
              <LucideUserSearch className="add-product-icon" onClick={() => setShowVendedorViewerModal(true)} />
            </Tooltip>
          </summary>
          <div className="client-order-details">
            {selectedVendedor ? (
              <div className="detail-item vendedor">
                <span className="detail-label">Asignado a</span>
                <span className="detail-value">
                  {selectedVendedor.nombre} {selectedVendedor.apellido}
                </span>
              </div>
            ) : (
              <div className="detail-item">
                <span className="detail-value alerta-sin-cliente" style={{ padding: "0.2rem" }}>
                  No se ha asignado un vendedor.
                </span>
              </div>
            )}
          </div>
        </details>
      </div>

      <div className="info-productos">
        <div className="order-header">
          <div className="flx" style={{ gap: "0.5rem" }}>
            <h3>Productos</h3>
          </div>
          <div>
            <Tooltip text="Agregar Producto">
              <LucidePlusCircle
                className="add-product-icon"
                size={28}
                onClick={() => setShowProductSearchModal(true)}
              />
            </Tooltip>
          </div>
        </div>

        {ordenItems.length > 0 ? (
          <div className="order-items-list">
            {ordenItems.map((item, index) => (
              <div
                key={`${item._id}-${item.talla}`}
                className={`order-item-row ${index === ordenItems.length - 1 ? "new-item" : ""}`}
              >
                <img
                  src={item.imageurl}
                  alt={item.nombre}
                  className="order-item-image"
                  onClick={() => setImagenAmpliadaUrl(item.imageurl)}
                />
                <div className="order-item-details">
                  <p className="item-name">{item.nombre}</p>
                  <p className="item-meta">
                    {item.marca} {item.modelo} {item.color} Talla {item.talla} ({item.codigo})
                  </p>
                </div>
                <div className="order-item-price">${Number(item.precio).toFixed(2)}</div>
                <div className="order-item-quantity">x {item.qty}</div>
                <div className="order-item-total">${(item.precio * item.qty).toFixed(2)}</div>
                <div className="order-item-actions">
                  <LucideTrash2 onClick={() => handleDeleteItem(index, item)} className="delete-item-icon" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-cart-message">
            <LucideShoppingBag size={48} />
            <p>Tu orden está vacía</p>
            <span>Agrega productos para comenzar.</span>
          </div>
        )}
      </div>

      {subtotal > 0 && (
        <div className="info-resumen">
          <h3>Resumen</h3>
          <div className="summary-row" style={{ fontSize: "1.3rem" }}>
            <span>Subtotal</span>
            <span className="facturacion-subtotal-value">${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row" style={{ fontSize: "1.3rem" }}>
            <label htmlFor="descuento">Descuento (-)</label>
            <input
              id="descuento"
              type="number"
              value={descuento.toFixed(2)}
              onChange={handleDescuentoChange}
              style={{
                width: "90px",
                textAlign: "right",
                padding: "2px 5px",
                fontSize: "1.3rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          <div className="summary-row" style={{ fontSize: "1.3rem" }}>
            <label htmlFor="delivery">Delivery (+)</label>
            <div className="select-wrapper-left" style={{ width: "100px" }}>
              <select
                id="delivery"
                value={delivery}
                onChange={(e) => setDelivery(Number(e.target.value))}
                style={{
                  textAlign: "right",
                  padding: "2px 5px",
                  fontSize: "1.3rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <option value={0}>$0.00</option>
                {Array.from({ length: 10 }, (_, i) => (i + 1) * 5).map((val) => (
                  <option key={val} value={val}>
                    ${val.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="summary-row total" style={{ fontSize: "1.4rem", marginTop: "0.5rem" }}>
            <span>Total</span>
            <span>${totalOrden.toFixed(2)}</span>
          </div>
          {cambioDia > 0 && (
            <div
              className="summary-row"
              style={{ color: "#007bff", fontWeight: "bold", marginTop: "0.5rem", fontSize: "1.3rem" }}
            >
              <span>Total Bs. (BCV: {cambioDia})</span>
              <span>Bs. {(totalOrden * cambioDia).toLocaleString("es-VE", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>
      )}
      {totalOrden > 0 && (
        <div className="info-pagos">
          <div className="order-header">
            <h3>Metodos de Pagos</h3>
            <Tooltip text="Gestionar Métodos de Pago">
              <LucidePlusCircle className="add-product-icon" onClick={handleOpenPagoModal} />
            </Tooltip>
          </div>
          <div className="payment-list-summary">
            {metodosPago.length > 0 ? (
              <>
                <details className="details-collapsible full-width">
                  <summary className="details-summary">
                    {" "}
                    <span>
                      <strong>Total Pagado: ${totalPagado.toFixed(2)}</strong>
                    </span>
                    {cambioDia > 0 && (
                      <span>
                        <strong>
                          (Bs. {(totalPagado * cambioDia).toLocaleString("es-VE", { minimumFractionDigits: 2 })})
                        </strong>
                      </span>
                    )}
                  </summary>
                  {(() => {
                    const metodosEnBolivares = ["PAGOMOVIL", "TDB", "TDC", "BOLIVARES", "TRANSFERENCIA"];
                    return metodosPago.map((pago, index) => {
                      const esPagoEnBs = metodosEnBolivares.includes(pago.tipo || pago.metodo);
                      let montoDisplay;

                      if (esPagoEnBs) {
                        // El monto ya está en Bolívares, solo se formatea.
                        montoDisplay = `Bs. ${pago.monto.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`;
                      } else {
                        const montoEnDolares = pago.monto;
                        const equivalenteEnBs = montoEnDolares * cambioDia;
                        montoDisplay = `$${montoEnDolares.toLocaleString("es-VE", {
                          minimumFractionDigits: 2,
                        })} (Bs. ${equivalenteEnBs.toLocaleString("es-VE", { minimumFractionDigits: 2 })})`;
                      }

                      return (
                        <div key={index} className="summary-row">
                          <span className="detail-label" style={{ textTransform: "none", fontSize: "1.2rem" }}>
                            {pago.tipo || pago.metodo}
                          </span>
                          <span>{montoDisplay}</span>
                        </div>
                      );
                    });
                  })()}
                </details>

                {totalOrden - totalPagado > 0.009 && condicion !== "Credito" && (
                  <div className="summary-row restante-pendiente" style={{ marginTop: "0.5rem" }}>
                    <span>
                      <strong>Falta por Pagar</strong>
                    </span>
                    <span>
                      <strong>${(totalOrden - totalPagado).toFixed(2)}</strong>
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="no-payment-message">No se han agregado métodos de pago.</p>
            )}
          </div>
        </div>
      )}

      {/* --- SECCIÓN DE MEMO / NOTAS --- */}
      {totalOrden > 0 && (
        <div
          className={`info-memo ${(condicion === "Donacion" || condicion === "Intercambio") && !memo.trim() ? "alerta-sin-cliente" : ""
            }`}
        >
          <h3>Memo / Notas</h3>
          <textarea
            id="memo-input"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows="2"
            style={{
              width: "100%",
              borderRadius: "5px",
              border: "1px solid #ced4da",
              padding: "8px",
            }}
            placeholder="Información adicional sobre la orden..."
          />
        </div>
      )}

      {/* 4. Renderizar el componente ClientSearch (es invisible) */}
      <ClientSearch
        ref={clientSearchRef}
        onClientFound={handleClientFound}
        onNewClient={handleNewClient}
        onCancel={handleSearchCancel}
      />

      <ModalsManager
        showNewClientModal={showNewClientModal}
        setShowNewClientModal={setShowNewClientModal}
        // Ya no necesitamos pasar las props de búsqueda de cliente al ModalsManager
        showClienteSearchModal={false} // Opcional: se puede dejar para no romper la interfaz de ModalsManager
        setShowClientSearchModal={() => { }} // Opcional: se puede dejar para no romper la interfaz de ModalsManager
        showProductSearchModal={showProductSearchModal}
        setShowProductSearchModal={setShowProductSearchModal}
        showMetodoPagoModal={showMetodoPagoModal}
        setShowMetodoPagoModal={setShowMetodoPagoModal}
        rif={rif}
        setRif={setRif}
        setClienteInfo={setClienteInfo}
        ordenItems={ordenItems}
        handleUpdateQuantity={handleUpdateQuantity}
        addItemToOrder={addItemToOrder}
        handleSavePagos={handleSavePagos}
        totalOrden={totalOrden}
        cambioDia={cambioDia}
      />

      <ProductViewer isOpen={showProductViewerModal} onClose={() => setShowProductViewerModal(false)} />

      <VendedorViewer
        isOpen={showVendedorViewerModal}
        onClose={() => setShowVendedorViewerModal(false)}
        onSelectVendedor={(vendedor) => {
          setVendedor(vendedor._id);
          setShowVendedorViewerModal(false);
        }}
        selectedVendedorId={vendedor}
      />

      <ClientViewer
        isOpen={showClientViewerModal}
        onClose={() => setShowClientViewerModal(false)}
        onSelectClient={(client) => {
          setClienteInfo(client);
          setShowClientViewerModal(false);
        }}
      />

      <button
        className="checkout-button"
        onClick={createOrderHandler}
        disabled={ordenItems.length === 0 || !clienteInfo || !vendedor || isCreatingOrder}
      >
        Crear Orden
      </button>
      {imagenAmpliadaUrl && (
        <div className="backdrop-imagen-ampliada" onClick={() => setImagenAmpliadaUrl(null)}>
          <img src={imagenAmpliadaUrl} alt="Imagen Ampliada" className="imagen-ampliada" />
        </div>
      )}
    </div>
  );
}

export default Facturacion;
