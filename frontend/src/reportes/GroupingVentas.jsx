import React, { useEffect, useState } from "react";
import GroupingReventasTable from "../components/GroupingReventasTable";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { consolidadoOrders } from "../actions/orderActions";
import { LucideCheck, LucidePrinter, LucideX } from "lucide-react";

function GroupingVentas() {
  const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [fechaFinal, setFechaFinal] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const dispatch = useDispatch();

  const consolidadoOrdersReport = useSelector((state) => state.consolidadoOrdersReport);
  const { loading, ventasGlobales } = consolidadoOrdersReport;

  useEffect(() => {
    dispatch(consolidadoOrders(fechaInicio, fechaFinal));
  }, []);

  const getFechaInicio = (fecha1) => {
    setFechaInicio(fecha1);
  };

  const getFechaFinal = (fecha2) => {
    setFechaFinal(fecha2);
  };

  const queryHandler = () => {
    dispatch(consolidadoOrders(fechaInicio, fechaFinal));
  };

  useEffect(() => { }, [dispatch]);

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
      header: "Condiciones",
      accessorKey: "condicion",
    },
    {
      header: "Vendedor",
      accessorKey: "nombre",
      footer: "",
    },
    {
      header: "Articulos",
      accessorKey: "orderItems",
      enableGrouping: false,
      cell: (info) => {
        const { orderItems } = info.row.original;
        if (info.row.original.tipo === "VENTA-MAYOR") {
          return <span>{orderItems.reduce((sum, item) => item.cantidad + sum, 0)}</span>;
        } else {
          return orderItems.map((p, inx) => {
            return (
              <span className="consolidado-articulos" key={inx}>
                {p.codigo + " talla " + p.talla}
              </span>
            );
          });
        }

        //<span>{orderItems.codigo + " talla " + orderItems.talla}</span>;
      },

      footer: "Total General >:",
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
        const merpoRow = model.find((x) => x.original.cumulativeMerpo > 0);

        const totalChacao = chacaoRow?.original.cumulativeChacao ? chacaoRow?.original.cumulativeChacao : 0;
        const totalMerpo = merpoRow?.original.cumulativeMerpo ? merpoRow?.original.cumulativeMerpo : 0;
        const totalFrailes = frailesRow?.original.cumulativeFrailes ? frailesRow?.original.cumulativeFrailes : 0;

        const totalConsolidado = Number(totalChacao + totalFrailes + totalMerpo).toFixed(2);

        // console.log("CHACAO:", totalChacao, "FRAILES:", totalFrailes);

        return "$" + totalConsolidado;
      },
    },
  ];
  console.log("ventasGlobales:", ventasGlobales);
  return (
    <div className="flx column pad-0">
      <div className="flx pad-0">
        <h2 className="mr-05">VENTAS CONSOLIDADAS</h2>
        <button className="plain-button" onClick={imprimir}>
          <LucidePrinter />
        </button>
      </div>
      <div className="flx pad-05 center">
        <button className="plain-button" onClick={resetHandler}>
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

        <button className="plain-button" onClick={queryHandler}>
          <LucideCheck />
        </button>
      </div>
      <p className="font-x">seleccione un rango de fechas y pulse el icono verde</p>

      <div className="table-container">
        {loading ? (
          <span>Cargando Datos...</span>
        ) : (
          <div className="mtop-1">
            {ventasGlobales?.length > 0 ? <GroupingReventasTable data={ventasGlobales} columns={columns} /> : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupingVentas;
