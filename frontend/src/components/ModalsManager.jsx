import Swal from "sweetalert2";
import ClientSearch from "./ClientSearch";
import ClientRegister from "./ClientRegister";
import ProductSearch from "./ProductSearch";
import MetodoPago from "./MetodoPago";

const ModalsManager = ({
  // Estados de visibilidad
  showNewClientModal,
  showClienteSearchModal,
  showProductSearchModal,
  showMetodoPagoModal,
  // Controladores de visibilidad
  setShowNewClientModal,
  setShowClientSearchModal,
  setShowProductSearchModal,
  setShowMetodoPagoModal,
  // Props y handlers necesarios para los modales
  rif,
  setRif,
  setClienteInfo,
  ordenItems,
  handleUpdateQuantity,
  addItemToOrder,
  handleSavePagos,
  totalOrden,
  cambioDia,
}) => {
  const handleProductFound = (product) => {
    setShowProductSearchModal(false); // Cierra el modal inmediatamente

    const itemIndex = ordenItems.findIndex((item) => item.codigo === product.codigo && item.talla === product.talla);

    if (itemIndex > -1) {
      // El producto ya existe en la orden
      const existingItem = ordenItems[itemIndex];
      if (existingItem.qty === product.qty) {
        // La cantidad es la misma, solo notificar
        Swal.fire({
          title: "Producto ya existe",
          html: `El producto <strong>${product.nombre} (Talla ${product.talla})</strong> con cantidad <strong>${product.qty}</strong> ya se encuentra en la orden.`,
          icon: "info",
        });
      } else {
        // La cantidad es diferente, actualizar
        handleUpdateQuantity(itemIndex, product.qty);
      }
    } else {
      // El producto es nuevo, agregarlo a la orden
      addItemToOrder(product);
    }
  };

  return (
    <>
      {/* --- MODAL DE REGISTRO DE NUEVO CLIENTE --- */}
      {showNewClientModal && (
        <div className="modal-container">
          <ClientRegister
            identificacion={rif}
            onRegisterSuccess={(newClient) => {
              setClienteInfo(newClient);
              setShowNewClientModal(false);
              setShowClientSearchModal(false);
            }}
            onCancel={() => setShowNewClientModal(false)}
          />
        </div>
      )}

      {/* --- MODAL DE BÚSQUEDA DE CLIENTE --- */}
      {showClienteSearchModal && (
        <ClientSearch
          onClientFound={(client) => setClienteInfo(client)}
          onNewClient={(id) => {
            setRif(id);
            setShowNewClientModal(true);
          }}
          onCancel={() => {
            setRif("");
            setClienteInfo(null);
            setShowClientSearchModal(false);
          }}
        />
      )}

      {/* --- MODAL DE BÚSQUEDA DE PRODUCTO --- */}
      {showProductSearchModal && (
        <div className="modal-container">
          <ProductSearch onProductFound={handleProductFound} onCancel={() => setShowProductSearchModal(false)} />
        </div>
      )}

      {/* --- MODAL DE MÉTODOS DE PAGO --- */}
      {showMetodoPagoModal && totalOrden > 0 && (
        <div className="modal-container">
          <MetodoPago
            onSave={handleSavePagos}
            onCancel={() => setShowMetodoPagoModal(false)}
            totalOrden={totalOrden}
            totalOrdenBs={totalOrden * cambioDia}
          />
        </div>
      )}
    </>
  );
};

export default ModalsManager;
