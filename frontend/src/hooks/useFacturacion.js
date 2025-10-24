import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useGetCambioQuery, useCreateOrderMutation } from "../api/ordersApi";
import { useGetVendedoresQuery } from "../api/usersApi";

function subtractHours(date, hours) {
  date.setHours(date.getHours() - hours);
  return date;
}

export const useFacturacion = () => {
  // --- ESTADOS ---
  const [fecha] = useState(subtractHours(new Date(), 6));
  const [cambioDia, setCambioDia] = useState(0);
  const [rif, setRif] = useState("");
  const [clienteInfo, setClienteInfo] = useState(null);
  const [vendedor, setVendedor] = useState("");
  const [condicion, setCondicion] = useState("Contado");
  const [ordenItems, setOrdenItems] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [memo, setMemo] = useState("");

  // --- ESTADOS DE UI (MODALES, ETC.) ---
  const [showClienteSearchModal, setShowClientSearchModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showProductSearchModal, setShowProductSearchModal] = useState(false);
  const [showMetodoPagoModal, setShowMetodoPagoModal] = useState(false);
  const [showProductViewerModal, setShowProductViewerModal] = useState(false);
  const [showClientViewerModal, setShowClientViewerModal] = useState(false);
  const [imagenAmpliadaUrl, setImagenAmpliadaUrl] = useState(null);

  // --- HOOKS Y SELECTORES ---
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userSignin);
  const { data: cambioData, isError: isCambioError } = useGetCambioQuery({});
  const { data: vendedores } = useGetVendedoresQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();

  // --- VALORES CALCULADOS (MEMOIZED) ---
  const subtotal = useMemo(() => ordenItems.reduce((acc, item) => acc + item.precio * item.qty, 0), [ordenItems]);
  const impuesto = useMemo(() => subtotal * 0.0, [subtotal]);
  const totalOrden = useMemo(
    () => Math.max(0, subtotal - descuento + impuesto + Number(delivery)),
    [subtotal, descuento, impuesto, delivery]
  );
  const totalPagado = useMemo(() => metodosPago.reduce((acc, pago) => acc + pago.monto, 0), [metodosPago]);

  // --- FUNCIONES Y MANEJADORES ---
  const resetFormulario = () => {
    setClienteInfo(null);
    setRif("");
    setVendedor("");
    setCondicion("Contado");
    setOrdenItems([]);
    setMetodosPago([]);
    setDescuento(0);
    setDelivery(0);
    setMemo("");
  };

  const getExchangeRate = async () => {
    if (cambioDia > 0) return cambioDia;
    let rate = 0;
    if (cambioData && cambioData.cambiobcv && !isCambioError) {
      rate = Number(cambioData.cambiobcv);
    } else {
      const { value: manualCambio } = await Swal.fire({
        title: "Tasa de Cambio BCV no disponible",
        text: "Por favor, ingrese la tasa de cambio del día manualmente:",
        input: "number",
        inputPlaceholder: "Ej: 36.50",
        showCancelButton: true,
        inputValidator: (v) => !v || isNaN(v) || (parseFloat(v) <= 0 && "Debe ingresar un valor numérico positivo."),
      });
      if (manualCambio) rate = parseFloat(manualCambio);
    }
    setCambioDia(rate);
    return rate;
  };

  const createOrderHandler = async () => {
    if ((condicion === "Donacion" || condicion === "Intercambio") && !memo.trim()) {
      return Swal.fire("Campo Requerido", "El campo 'Memo / Notas' es obligatorio.", "warning");
    }
    if (condicion !== "Credito" && Math.abs(totalOrden - totalPagado).toFixed(2) !== "0.00") {
      return Swal.fire("Monto Incompleto", `El total pagado no coincide con el total de la orden.`, "warning");
    }
    if (!cambioDia || cambioDia === 0) {
      return Swal.fire("Operación Cancelada", "No se puede crear la orden sin una tasa de cambio válida.", "error");
    }

    try {
      const { data: newOrder } = await createOrder({
        fecha,
        clienteInfo,
        orderItems: ordenItems,
        pago: metodosPago,
        totalItems: ordenItems.reduce((a, c) => a + c.qty, 0),
        subtotal,
        descuento,
        delivery,
        totalVenta: totalOrden,
        cambioDia,
        condicion,
        vendedor,
        user: userInfo,
        memo,
        iva: impuesto,
      });
      resetFormulario();
      navigate(`/print/order/${newOrder.order._id}`);
    } catch (error) {
      Swal.fire("Error al Crear la Orden", error.data?.message || error.error || "Ocurrió un error.", "error");
    }
  };

  const addItemToOrder = (product) => {
    setOrdenItems((prevItems) => [...prevItems, product]);
    setShowProductSearchModal(false);
  };

  const deleteItemFromOrder = (index) => {
    setOrdenItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleDescuentoChange = (e) => {
    let value = Number(e.target.value);
    if (value < 0) value = 0;
    if (value > subtotal) {
      value = subtotal;
      Swal.fire("Atención", "El descuento no puede ser mayor que el subtotal.", "warning");
    }
    setDescuento(value);
  };

  const handleCondicionChange = (e) => {
    const newCondicion = e.target.value;
    setCondicion(newCondicion);
    if (newCondicion === "Credito") setMetodosPago([]);
    else if (newCondicion === "Contado" && totalOrden > 0 && totalPagado < totalOrden) setShowMetodoPagoModal(true);
  };

  const handleOpenPagoModal = async () => {
    const rate = await getExchangeRate();
    if (rate > 0) setShowMetodoPagoModal(true);
    else Swal.fire("Acción cancelada", "Se requiere una tasa de cambio para gestionar los pagos.", "info");
  };

  const handleSavePagos = useCallback((pagos) => {
    setMetodosPago(pagos);
    setShowMetodoPagoModal(false);
    // Evitamos mostrar el Swal si solo estamos reseteando los pagos.
    if (pagos.length > 0) {
      Swal.fire("Guardado", "Métodos de pago actualizados.", "success");
    }
  }, []);

  // --- EFECTOS ---
  useEffect(() => {
    const checkAndSetRate = async () => {
      if (totalOrden > 0 && cambioDia === 0) await getExchangeRate();
    };
    checkAndSetRate();
  }, [totalOrden, cambioDia]);

  // --- VALORES Y FUNCIONES EXPUESTAS ---
  return {
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
    subtotal,
    impuesto,
    totalOrden,
    totalPagado,
    vendedores,
    isCreatingOrder,
    // Manejadores de estado de UI
    showClienteSearchModal,
    setShowClientSearchModal,
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
    setOrdenItems,
    handleOpenPagoModal,
    handleSavePagos,
    createOrderHandler,
  };
};
