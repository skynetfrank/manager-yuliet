import { useEffect, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { cargarStock } from "../actions/productActions";
import { useDispatch, useSelector } from "react-redux";
import { listReposiciones } from "../actions/reposicionActions";

function ReporteReposiciones() {
  const navigate = useNavigate("");

  const reposicionList = useSelector((state) => state.reposicionList);
  const { loading, error, reposiciones } = reposicionList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listReposiciones());
  }, []);

  const columns = [
    {
      header: "Fecha",
      accessorKey: "fecha",
      cell: (value) => {
        return dayjs(new Date(value.getValue())).format("DD/MM/YYYY");
      },
    },
    { header: "ID-Reposicion", accessorKey: "_id" },

    { header: "Unidades", accessorKey: "totalUnidades" },
    {
      header: "status",
      accessorKey: "procesado",
      cell: (value) => {
        return value.getValue() === true ? "Procesado" : "Pendiente";
      },
    },
    {
      header: "Detalle",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return <button onClick={() => navigate(`/reposicion/${_id}`)}>Ver Detalle</button>;
      },
    },
  ];

  return (
    <div>
      <div className="flx jcenter gap">
        <h3 className="centrado">REPOSICIONES DE MERCANCIA</h3>
        <button onClick={() => navigate("/crearreposicion")}>Crear Nuevo</button>
      </div>
      {loading ? (
        <span>descargando datos del Servidor...</span>
      ) : (
        <>
          <div>
            <div>{reposiciones ? <SimpleTable data={reposiciones} columns={columns} botonera={true} /> : ""}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReporteReposiciones;

//onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
