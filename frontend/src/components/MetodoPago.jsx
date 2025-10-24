import { useState, useMemo, useReducer } from "react";
import { LucideXSquare, LucidePlus, LucideTrash2, LucideSave, LucideWallet } from "lucide-react";
import Swal from "sweetalert2";

// --- Estado inicial y reducer para el formulario de pago ---
const initialState = {
  metodo: "",
  monto: "",
  referencia: "",
  bancoOrigen: "",
  bancoDestino: "",
  memo: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function MetodoPago({ onCancel, onSave, totalOrden, totalOrdenBs }) {
  // --- Estado para la lista de pagos ---
  const [pagos, setPagos] = useState([]);

  // --- Usamos useReducer para el estado del formulario ---
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { metodo, monto, referencia, bancoOrigen, bancoDestino, memo } = formState;

  // --- Listas de opciones para los selects ---
  const metodosDisponibles = [
    { value: "PAGOMOVIL", label: "Pago Móvil" },
    { value: "TDB", label: "Tarjeta de Débito" },
    { value: "TDC", label: "Tarjeta de Crédito" },
    { value: "EUROS", label: "Divisas (Euros)" },
    { value: "DOLARES", label: "Divisas (Dólares)" },
    { value: "BOLIVARES", label: "Efectivo (Bolívares)" },
    { value: "ZELLE", label: "Zelle" },
    { value: "TRANSFERENCIA", label: "Transferencia" },
    { value: "PAGOCASHEA", label: "Pago Cashea" },
  ];

  const metodosEnBolivares = ["PAGOMOVIL", "TDB", "TDC", "BOLIVARES", "TRANSFERENCIA"];

  const bancosDisponibles = ["Venezuela", "Banesco", "Mercantil", "Provincial", "BNC", "Banco Plaza"];

  // --- Tasa de cambio ---
  const cambioDia = useMemo(() => (totalOrden > 0 ? totalOrdenBs / totalOrden : 0), [totalOrden, totalOrdenBs]);

  // --- Lógica para mostrar campos condicionales ---
  const necesitaReferencia = ["PAGOMOVIL", "TDB", "TDC", "ZELLE", "TRANSFERENCIA", "PAGOCASHEA"].includes(metodo);
  const necesitaBancoOrigen = ["PAGOMOVIL", "TDB", "TDC", "TRANSFERENCIA"].includes(metodo);
  const necesitaBancoDestino = ["PAGOMOVIL", "TDB", "TDC", "TRANSFERENCIA"].includes(metodo);
  const esPagoEnBolivares = metodosEnBolivares.includes(metodo);

  // --- Cálculos para el resumen de pagos ---
  // totalPagado y restante siempre se calculan en USD para consistencia
  const totalPagado = useMemo(() => pagos.reduce((acc, pago) => acc + parseFloat(pago.montoUSD), 0), [pagos]);
  const restante = useMemo(() => totalOrden - totalPagado, [totalOrden, totalPagado]);
  const restanteBs = useMemo(() => restante * cambioDia, [restante, cambioDia]);
  const simboloMoneda = esPagoEnBolivares ? "Bs." : "$";

  // --- Manejador centralizado para actualizar campos del formulario ---
  const handleFieldChange = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const handleAddPago = () => {
    // Validaciones básicas
    if (!metodo || !monto || parseFloat(monto) <= 0) {
      Swal.fire("Atención", "Debe seleccionar un método de pago y un monto válido.", "warning");
      return;
    }

    // --- VALIDACIONES DE CAMPOS OBLIGATORIOS ---
    if (necesitaReferencia && !referencia.trim()) {
      const fieldName = metodo === "PAGOCASHEA" ? "Número de Orden" : "Referencia";
      Swal.fire("Campo Requerido", `Por favor, ingrese el campo '${fieldName}'.`, "warning");
      return;
    }
    if (necesitaBancoOrigen && !bancoOrigen) {
      Swal.fire("Campo Requerido", "Por favor, seleccione un 'Banco Origen'.", "warning");
      return;
    }
    if (necesitaBancoDestino && !bancoDestino) {
      Swal.fire("Campo Requerido", "Por favor, seleccione un 'Banco Destino'.", "warning");
      return;
    }

    let nuevoPago;
    const montoNumerico = parseFloat(monto);

    if (esPagoEnBolivares) {
      if (cambioDia === 0) {
        Swal.fire("Error", "No hay tasa de cambio para pagos en Bolívares.", "error");
        return;
      }
      const montoEnUSD = montoNumerico / cambioDia;

      if (totalPagado + montoEnUSD > totalOrden + 0.001) {
        Swal.fire("Monto Excedido", `El monto a pagar no puede ser mayor al restante. Restan: $${restante.toFixed(2)}`, "error");
        return;
      }

      nuevoPago = {
        tipo: metodo,
        monto: montoNumerico, // Se guarda el monto en Bolívares
        moneda: "Bs.",
        montoUSD: montoEnUSD, // Se guarda el equivalente en USD para cálculos
      };
    } else {
      // Para DOLARES, EUROS, ZELLE
      if (totalPagado + montoNumerico > totalOrden + 0.001) {
        Swal.fire("Monto Excedido", `El monto a pagar no puede ser mayor al restante. Restan: $${restante.toFixed(2)}`, "error");
        return;
      }
      nuevoPago = {
        tipo: metodo,
        monto: montoNumerico, // Se guarda el monto en USD
        moneda: "$",
        montoUSD: montoNumerico,
      };
    }

    // Agregamos los campos condicionales al objeto 'nuevoPago'
    Object.assign(nuevoPago, {
      ...(necesitaReferencia && referencia && { referencia }),
      ...(necesitaBancoOrigen && bancoOrigen && { bancoOrigen }),
      ...(necesitaBancoDestino && bancoDestino && { bancoDestino }),
      ...(memo && { memo })
    });

    setPagos([...pagos, nuevoPago]);
    dispatch({ type: "RESET" }); // Reseteamos el formulario con una sola acción
  };

  const handleRemovePago = (index) => {
    setPagos(pagos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Verificación final: el monto pagado debe ser igual al total de la orden
    if (Math.abs(restante).toFixed(2) !== "0.00") {
      Swal.fire(
        "Verifique los montos",
        `El total pagado ($${totalPagado.toFixed(2)}) no coincide con el total de la orden ($${totalOrden.toFixed(
          2
        )}). Restan: $${restante.toFixed(2)}`,
        "error"
      );
      return;
    }

    onSave(pagos);
  };

  return (
    <div className="modal-container">
      <div className="form-container" style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
        <div className="modal-close-container">
          <LucideXSquare className="close-icon light" onClick={onCancel} />
          <div>
            Total Orden:{" "}
            <strong>
              ${totalOrden.toFixed(2)} (Bs. {totalOrdenBs.toFixed(2)})
            </strong>
          </div>
          <h3 className="white">Gestión de Pagos</h3>
        </div>

        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Método de Pago</label>
              <select value={metodo} onChange={(e) => handleFieldChange("metodo", e.target.value)}>
                <option value="">Seleccione un método...</option>
                {metodosDisponibles.map((m) => {
                  const esBs = metodosEnBolivares.includes(m.value);
                  const deshabilitado = esBs && cambioDia === 0;
                  return (
                    <option key={m.value} value={m.value} disabled={deshabilitado}>
                      {m.label} {deshabilitado ? "(Tasa no disp.)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="form-group">
              <label>Monto ({simboloMoneda})</label>
              <div className="input-with-button">
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => handleFieldChange("monto", e.target.value)}
                  placeholder={esPagoEnBolivares ? restanteBs.toFixed(2) : restante.toFixed(2)}
                />
                <button
                  type="button"
                  className="link-like-btn"
                  title="Usar monto restante"
                  onClick={() => {
                    const montoRestante = esPagoEnBolivares ? restanteBs.toFixed(2) : restante.toFixed(2);
                    handleFieldChange("monto", montoRestante);
                  }}
                >
                  <LucideWallet size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            {necesitaBancoOrigen && (
              <div className="form-group">
                <label>Banco Origen</label>
                <select value={bancoOrigen} onChange={(e) => handleFieldChange("bancoOrigen", e.target.value)}>
                  <option value="">Seleccione...</option>
                  {bancosDisponibles.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {necesitaBancoDestino && (
              <div className="form-group">
                <label>Banco Destino</label>
                <select value={bancoDestino} onChange={(e) => handleFieldChange("bancoDestino", e.target.value)}>
                  <option value="">Seleccione...</option>
                  {bancosDisponibles.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {necesitaReferencia && (
            <div className="form-group">
              <label>Referencia</label>
              <input
                type="text"
                value={referencia}
                onChange={(e) => handleFieldChange("referencia", e.target.value)}
                maxLength={metodo === "PAGOCASHEA" ? "20" : "12"}
                placeholder={metodo === "PAGOCASHEA" ? "Número de Orden Cashea" : ""}
              />
            </div>
          )}

          <div className="form-group">
            <label>Memo (Opcional)</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => handleFieldChange("memo", e.target.value)}
              placeholder="Información adicional sobre el pago..."
            ></input>
          </div>

          <button type="button" className="add-button" onClick={handleAddPago}>
            <LucidePlus size={18} /> Agregar Pago
          </button>
          <div className="payment-summary">
            <h4 className="centrado">Pagos Agregados</h4>
            <div className="payment-list">
              {pagos.map((pago, index) => (
                <div key={index} className="payment-item">
                  <span>
                    {pago.tipo}: <strong>{pago.moneda} {pago.monto.toFixed(2)}</strong>
                    {pago.referencia && ` (Ref: ${pago.referencia})`}
                  </span>
                  <LucideTrash2 className="delete-item-icon" onClick={() => handleRemovePago(index)} />
                </div>
              ))}
              {pagos.length === 0 && <p className="no-payment-message">Aún no se han agregado pagos.</p>}
            </div>
            <div className="payment-totals">
              <div>
                Total Pagado: <strong>${totalPagado.toFixed(2)}</strong>
              </div>
              <div className={restante.toFixed(2) !== "0.00" ? "restante-pendiente" : "restante-ok"}>
                Restante: <strong>${restante.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="submit-button" disabled={pagos.length === 0}>
          <LucideSave size={18} /> Guardar Pagos y Cerrar
        </button>
      </div>
    </div>
  );
}
