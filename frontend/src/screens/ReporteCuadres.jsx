import React, { useMemo, Fragment } from "react";
import { useNavigate } from "react-router";
import SimpleTable from "../components/SimpleTable";
import { LucideBadgeDollarSign, LucideChevronRight, LucideChevronDown } from "lucide-react";
import { useGetGroupedByDayQuery } from "../api/ordersApi";

// Helper para formatear moneda
const formatCurrency = (value) => {
  if (typeof value !== "number") return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
};

function ReporteCuadres() {
  const navigate = useNavigate();

  // Reemplazamos useDispatch y useSelector con una sola llamada a RTK Query.
  // RTK Query maneja automáticamente el estado de carga, error y los datos.
  const { data: dailyOrders, isLoading: loading, isError: error } = useGetGroupedByDayQuery();

  // Componente que renderiza la sub-tabla con los items vendidos
  const RenderSubComponent = ({ row }) => {
    const { itemsSold } = row.original;
    return (
      <div style={{ padding: "10px 20px", background: "#f1f1f1" }}>
        <h4>Artículos Vendidos en el Día</h4>
        <table className="sub-table" style={{ width: "100%", fontSize: "1.2rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Producto</th>
              <th style={{ textAlign: "center" }}>Talla</th>
              <th style={{ textAlign: "center" }}>Cant.</th>
              <th style={{ textAlign: "right" }}>Total Venta</th>
            </tr>
          </thead>
          <tbody>
            {itemsSold.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className="flx" style={{ gap: "10px" }}>
                    <img src={item.imageurl} alt={item.nombre} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                    <span>{item.nombre} ({item.codigo})</span>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>{item.talla}</td>
                <td style={{ textAlign: "center" }}>{item.qty}</td>
                <td style={{ textAlign: "right" }}>{formatCurrency(item.totalVentaItem)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Usamos useMemo para que las columnas no se recalculen en cada render.
  const columns = useMemo(
    () => [
      {
        header: "Dia",
        accessorKey: "_id",
        cell: (info) => {
          const [year, month, day] = info.getValue().split("-");
          return `${day}-${month}-${year}`;
        },
      },


      { header: "Ventas", accessorKey: "totalOrders" },
      {
        header: "Monto US$",
        accessorKey: "totalSales",
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <button
              className="btn-icon-container flx"
              style={{ gap: "0.5rem", border: "none", background: "transparent", cursor: "pointer" }}
              {...{ onClick: row.getToggleExpandedHandler() }}
            >
              <span style={{ fontWeight: 500, fontSize: "1.2rem" }}>Detalle</span>
              {row.getIsExpanded() ? <LucideChevronDown size={16} /> : <LucideChevronRight size={16} />}
            </button>
          ) : null;
        },
      },


    ],
    [navigate]
  );

  return (
    <div>
      <div className="flx jcenter">
        <h2 className="centrado">Reporte de Ventas Diarias</h2>
      </div>

      {loading ? (
        <span>descargando datos del Servidor...</span>
      ) : error ? (
        <span>Error al cargar los datos.</span>
      ) : (
        <>
          <div>
            <div>
              {dailyOrders ? (
                <SimpleTable
                  data={dailyOrders}
                  columns={columns}
                  filterInput={false}
                  botonera={true}
                  renderSubComponent={RenderSubComponent}
                  getRowCanExpand={() => true}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReporteCuadres;
