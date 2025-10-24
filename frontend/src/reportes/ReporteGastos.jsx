import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { deleteGasto, listGastos } from "../actions/gastoActions";

import { GASTO_DELETE_RESET } from "../constants/gastoConstants";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import SimpleTable from "../components/SimpleTable";
import ToolTip from "../components/ToolTip";
import { LucideEdit, LucideFilePlus, LucidePrinter, LucideTrash } from "lucide-react";

function ReporteGastos() {
  const navigate = useNavigate("");
  const dispatch = useDispatch();

  const gastoList = useSelector((state) => state.gastoList);
  const { loading, gastos } = gastoList;

  const gastoDelete = useSelector((state) => state.gastoDelete);
  const { success: successDelete } = gastoDelete;

  useEffect(() => {
    dispatch(listGastos());
  }, [dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm("Esta Seguro de Eliminar Este Gasto?")) {
      dispatch(deleteGasto(id));
    }
  };

  useEffect(() => {
    if (successDelete) {
      dispatch({ type: GASTO_DELETE_RESET });
    }
    dispatch(listGastos({}));
  }, [dispatch, successDelete]);

  const columns = [
    {
      header: "Fecha",
      accessorKey: "fecha",
      cell: (value) => {
        return dayjs(new Date(value.getValue())).format("DD/MM/YYYY");
      },
    },
    { header: "Beneficiario", accessorKey: "beneficiario" },
    { header: "Descripcion", accessorKey: "descripcion" },
    {
      header: "Monto",
      accessorKey: "montousd",
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },
    {
      header: "Monto",
      accessorKey: "montobs",
      cell: (value) => {
        return "Bs." + Number(value.getValue()).toFixed(2);
      },
    },
    { header: "Registrado Por", accessorKey: "registradopor" },

    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <div className="flx pad-0">
            {" "}
            <button className="btn-icon-container" onClick={() => navigate(`/printgasto/${_id}`)}>
              <LucidePrinter />
            </button>
            <button className="btn-icon-container" onClick={() => navigate(`/gasto/${_id}/edit`)}>
              <LucideEdit />
            </button>
            <button className="btn-icon-container" onClick={() => deleteHandler(_id)}>
              <LucideTrash />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flx jcenter">
        <h2 className="centrado">GASTOS</h2>
        <Link to={"/creargasto"}>
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
            <div>
              {gastos ? <SimpleTable data={gastos} columns={columns} filterInput={true} botonera={true} /> : ""}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReporteGastos;

//onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
