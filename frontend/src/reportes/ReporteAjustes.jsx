import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import SimpleTable from "../components/SimpleTable";
import ToolTip from "../components/ToolTip";
import { listAjustes } from "../actions/ajusteActions";
import { LucideFilePlus, LucideSearch } from "lucide-react";

function ReporteAjustes() {
  const navigate = useNavigate("");
  const dispatch = useDispatch();

  const ajusteList = useSelector((state) => state.ajusteList);
  const { loading, error, ajustes } = ajusteList;

  useEffect(() => {
    dispatch(listAjustes());
  }, [dispatch]);

  const columns = [
    {
      header: "Fecha",
      accessorKey: "fecha",
      cell: (value) => {
        return dayjs(new Date(value.getValue())).format("DD/MM/YYYY");
      },
    },
    {
      header: "Monto",
      accessorKey: "totalItems",
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },
    {
      header: "Unidades",
      accessorKey: "totalUnidades",
      cell: (value) => {
        return Number(value.getValue()).toFixed(0);
      },
    },
    {
      header: "Registrado Por",
      accessorKey: "user",
      cell: (value) => {
        if (!value.getValue()) {
          return "";
        }

        return value.getValue().nombre + " " + value.getValue().apellido;
      },
    },

    {
      header: "Detalle",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <div className="flx pad-0">
            <button className="btn-icon-container" onClick={() => navigate(`/ajuste/${_id}`)}>
              <LucideSearch />
            </button>
          </div>
        );
      },
    },
  ];
  console.log("ajustes", ajustes);
  return (
    <div>
      <div className="flx jcenter">
        <h2 className="centrado">AJUSTES AL INVENTARIO</h2>
        <Link to={"/crearajuste"}>
          <ToolTip text="Registrar Nuevo Gasto">
            <button className="btn-icon-container">
              <LucideFilePlus />
            </button>
          </ToolTip>
        </Link>
      </div>

      {loading ? (
        <span>descargando datos del Servidor...</span>
      ) : (
        <>
          <div>
            <div>{ajustes ? <SimpleTable data={ajustes} columns={columns} botonera={true} /> : ""}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReporteAjustes;

//onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
