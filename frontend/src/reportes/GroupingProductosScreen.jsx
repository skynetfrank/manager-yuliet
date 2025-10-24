import { useEffect, useState } from "react";
import GroupingProductosTable from "../components/GroupingProductosTable";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { allOrders } from "../actions/orderActions";
import { LucideCheck, LucidePrinter, LucideX } from "lucide-react";

function GroupingProductosScreen() {
  const [fechaInicio, setFechaInicio] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const [fechaFinal, setFechaFinal] = useState(dayjs(new Date()).format("YYYY-MM-DD"));
  const dispatch = useDispatch();

  const orderAll = useSelector((state) => state.orderAll);
  const { loading, itemsVendidos } = orderAll;

  useEffect(() => {
    dispatch(allOrders(fechaInicio, fechaFinal));
  }, []);

  const getFechaInicio = (fecha1) => {
    setFechaInicio(fecha1);
  };

  const getFechaFinal = (fecha2) => {
    setFechaFinal(fecha2);
  };

  const queryHandler = () => {
    dispatch(allOrders(fechaInicio, fechaFinal));
  };

  useEffect(() => {}, [dispatch]);

  const resetHandler = () => {
    const f1 = dayjs(new Date()).format("YYYY-MM-DD");
    const f2 = dayjs(new Date()).format("YYYY-MM-DD");
    setFechaFinal(f2);
    setFechaInicio(f1);
    dispatch(allOrders(f1, f2));
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
      header: "Codigo",
      accessorKey: "orderItems.codigo",
    },
    {
      header: "Marca",
      accessorKey: "orderItems.marca",
    },
    {
      header: "Cantidad",
      accessorKey: "orderItems.qty",
      enableGrouping: false,
    },
    {
      header: "Talla",
      accessorKey: "orderItems.talla",
    },
    {
      header: "Precio",
      accessorKey: "orderItems.precio",
    },
  ];

  return (
    <div className="div-print-report">
      <button className="btn-print-report weekly" onClick={imprimir}>
        <LucidePrinter />
      </button>
      <div className="weekly-report-header">
        <h2 className="h2-weekly">ANALISIS POR PRODUCTO</h2>

        <div className="flx center">
          <button className="btn-icon-container" onClick={resetHandler}>
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
        <p className="tiny-size">seleccione un rango de fechas y pulse el icono verde</p>
      </div>
      <div className="table-container">
        {loading ? (
          <span>Cargando Datos...</span>
        ) : (
          <div>
            {itemsVendidos?.length > 0 ? <GroupingProductosTable data={itemsVendidos} columns={columns} /> : ""}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupingProductosScreen;
