import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import GroupingCasheaTable from "../components/GroupingCasheaTable";
import { useDispatch, useSelector } from "react-redux";
import { allOrders } from "../actions/orderActions";

function GroupingCashea() {
  const dispatch = useDispatch();

  const ordersAll = useSelector((state) => state.orderAll);
  const { loading, error, orders, resumen } = ordersAll;

  useEffect(() => {
    dispatch(allOrders());
  }, [dispatch]);

  const columns = [
    {
      header: "Fecha",
      accessorKey: "fechax",
      cell: (info) => {
        return dayjs(info.getValue()).format("DD/MM/YYYY");
      },
    },
    {
      header: "#Orden",
      accessorKey: "pago.cashea.orden",
      enableGrouping: false,
    },
    {
      header: "Total Venta",
      accessorKey: "subtotal",
      enableGrouping: false,
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },

    {
      header: "Pago Inicial",
      accessorKey: "total",
      enableGrouping: false,
      cell: ({ row }) => {
        const montoSubtotal = row.original.subtotal;
        const montoCashea = row.original.pago.cashea?.monto;
        return "$" + Number(montoSubtotal - montoCashea).toFixed(2);
      },
    },
    {
      header: "Monto Cashea",
      accessorKey: "pago.cashea.monto",
      enableGrouping: false,
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },

    {
      header: "Cliente",
      accessorKey: "clienteInfo.nombre",
      enableGrouping: false,
    },
    {
      header: "Detalles",
      accessorKey: "_id",
      enableGrouping: false,
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <button className="edit-cliente-btn" onClick={() => navigate(`/order/${_id}`)}>
            Ver Nota{" "}
          </button>
        );
      },
    },
  ];
  console.log("resumen", resumen);
  return (
    <div>
      <h2 className="centrado">Ventas Por Cashea</h2>
      <div className="flx column jcenter font-1">
        <p>Numero de Ventas por Cashea: {resumen?.numOrders} </p>
        <p>Total Vendido via Cashea: ${Number(resumen?.totalVentas).toFixed(2)} </p>
        <p>Monto Financiado por Cashea: ${Number(resumen?.totalCashea).toFixed(2)} </p>
      </div>

      <>
        <div>
          <div>
            {orders ? <GroupingCasheaTable data={orders} columns={columns} filterInput={true} botonera={true} /> : ""}
          </div>
        </div>
      </>
    </div>
  );
}

export default GroupingCashea;
