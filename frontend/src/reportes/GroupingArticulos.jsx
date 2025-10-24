import React, { useEffect, useState } from "react";
import GroupingReventasTable from "../components/GroupingReventasTable";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { consolidadoArticulos, consolidadoOrders } from "../actions/orderActions";
import { LucideCheck, LucidePrinter, LucideX } from "lucide-react";

function GroupingArticulos() {
  const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [fechaFinal, setFechaFinal] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const dispatch = useDispatch();

  const consolidadoArticulosReport = useSelector((state) => state.consolidadoArticulosReport);
  const { loading, ventasGlobales } = consolidadoArticulosReport;

  useEffect(() => {
    dispatch(consolidadoArticulos(fechaInicio, fechaFinal));
  }, []);

  const getFechaInicio = (fecha1) => {
    setFechaInicio(fecha1);
  };

  const getFechaFinal = (fecha2) => {
    setFechaFinal(fecha2);
  };

  const queryHandler = () => {
    dispatch(consolidadoArticulos(fechaInicio, fechaFinal));
  };

  useEffect(() => {}, [dispatch]);

  const resetHandler = () => {
    const f1 = dayjs(new Date()).format("YYYY-MM-DD");
    const f2 = dayjs(new Date()).format("YYYY-MM-DD");
    setFechaFinal(f2);
    setFechaInicio(f1);
    dispatch(consolidadoOrders(f1, f2));
  };
  const imprimir = () => {
    window.print();
  };

  const columns = [
    {
      header: "Fecha",
      accessorKey: "fecha",
      cell: (info) => {
        return dayjs(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "Origen",
      accessorKey: "_id",
    },
    {
      header: "Vendedor",
      accessorKey: "nombre",
      footer: "",
    },
    {
      header: "Codigo",
      accessorKey: "orderItems.codigo",
    },

    {
      header: "Monto $",
      accessorKey: "subtotal",
      enableGrouping: false,
      cell: (info) => {
        return "$" + Number(info.getValue()).toFixed(2);
      },

      aggregationFn: "sum",
      aggregatedCell: ({ row }) => {
        return Number(row.getValue("subtotal")).toFixed(2);
      },
      footer: ({ table }) => {
        const model = table.getFilteredRowModel().rows;

        const chacaoRow = model.find((x) => x.original.cumulativeChacao > 0);
        const frailesRow = model.find((x) => x.original.cumulativeFrailes > 0);

        const totalChacao = chacaoRow?.original.cumulativeChacao ? chacaoRow?.original.cumulativeChacao : 0;
        const totalFrailes = frailesRow?.original.cumulativeFrailes ? frailesRow?.original.cumulativeFrailes : 0;

        const totalConsolidado = Number(totalChacao + totalFrailes).toFixed(2);

        console.log("CHACAO:", totalChacao, "FRAILES:", totalFrailes);

        return "$" + totalConsolidado;
      },
    },
  ];
  console.log("ventasGlobales:", ventasGlobales);
  return (
    <div className="div-print-report">
      <button className="btn-print-report weekly" onClick={imprimir}>
        <LucidePrinter />
      </button>
      <div className="weekly-report-header">
        <h2 className="h2-weekly">VENTAS CONSOLIDADAS</h2>

        <div className="flx center">
          <button className="btn-close-report" onClick={resetHandler}>
            <LucideX />
          </button>
          <input
            type="date"
            className="input-report"
            id="fecha-inicio"
            value={fechaInicio}
            onChange={(e) => getFechaInicio(e.target.value)}
          />
          <input
            type="date"
            id="fecha-final"
            className="input-report"
            value={fechaFinal}
            onChange={(e) => getFechaFinal(e.target.value)}
          />

          <button className="btn-query-report" onClick={queryHandler}>
            <LucideCheck />
          </button>
        </div>
        <p>seleccione un rango de fechas y pulse el icono verde</p>
      </div>
      <div className="table-container">
        {loading ? (
          <span>Cargando Datos...</span>
        ) : (
          <div>
            {ventasGlobales?.length > 0 ? <GroupingReventasTable data={ventasGlobales} columns={columns} /> : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupingArticulos;
