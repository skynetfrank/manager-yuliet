import { useEffect, useState } from "react";
import SimpleTable from "../components/SimpleTable";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { EMPLEADO_ADDVALE_RESET, EMPLEADO_DELETE_RESET } from "../constants/empleadoConstants";
import { addVale, deleteEmpleado, listEmpleados } from "../actions/empleadoActions";
import ToolTip from "../components/ToolTip";
import Swal from "sweetalert2";
import { LucideFilePlus } from "lucide-react";

function ReporteEmpleados() {
  const navigate = useNavigate("");
  const [cambio] = useState(Number(localStorage.getItem("cambioBcv")).toFixed(2));

  const empleadoList = useSelector((state) => state.empleadoList);
  const { loading, error, empleados } = empleadoList;

  const empleadoAddVale = useSelector((state) => state.empleadoAddVale);
  const { success } = empleadoAddVale;

  const empleadoDelete = useSelector((state) => state.empleadoDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = empleadoDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listEmpleados());
  }, [dispatch]);

  const deleteHandler = (empleado) => {
    if (globalThis.window.confirm("Esta Seguro de Eliminar Este Gasto?")) {
      dispatch(deleteEmpleado(empleado._id));
    }
  };

  const addValeHandler = async (empleadoId, nombre, apellido) => {
    const { value: amount } = await Swal.fire({
      title: nombre + " " + apellido,
      input: "text",
      inputLabel: "Vale a Descontar de Nomina",
      inputPlaceholder: "ingrese monto en Dolares",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Este campo no debe estar vacio!";
        }
      },
    });

    if (!amount) {
      Swal.fire({
        title: "No se Registro el Vale!",
        text: "Proceso Cancelado",
      });
      return;
    }

    if (amount === 0) {
      Swal.fire({
        title: "El monto No Puede ser Cero!",
        text: "Proceso Cancelado",
      });
      return;
    }
    const fechaEntrega = new Date();
    const montousd = Number(amount);
    const montobs = Number(amount) * Number(cambio);
    const cambiodia = cambio;
    const concepto = "Descontar Nomina Quimcenal";
    dispatch(addVale(empleadoId, { fechaEntrega, montousd, montobs, cambiodia, concepto }));
  };

  const columns = [
    {
      header: "Foto",
      accessorKey: "empleadoAvatarUrl",
      cell: (info) => {
        return (
          <div>
            {info.getValue() ? <img className="table-img b-radius circle" src={info.getValue()} /> : <EmpleadoIcon />}
          </div>
        );
      },
    },
    {
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      header: "Apellido",
      accessorKey: "apellido",
    },
    { header: "Cedula", accessorKey: "cedula" },
    { header: "Telefono", accessorKey: "telefono" },

    {
      header: "opciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id, nombre, apellido } = value.row.original;
        return (
          <div className="flx wrap">
            <button className="edit-cliente-btn" onClick={() => navigate(`/empleado/${_id}`)}>
              Ver Ficha
            </button>
            {/*  <button className="edit-cliente-btn" onClick={() => deleteHandler(_id)}>
              Eliminar
            </button> */}
            <button className="edit-cliente-btn" onClick={() => addValeHandler(_id, nombre, apellido)}>
              Registrar Vale
            </button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (success) {
      Swal.fire({
        title: "VALE REGISTRADO!",
        text: "Registrar Vale!",
        icon: "success",
      });
      dispatch({ type: EMPLEADO_ADDVALE_RESET });
    }
  }, [dispatch, success]);

  return (
    <div>
      <div className="flx jcenter">
        <h2 className="centrado">EMPLEADOS</h2>
        <Link to={"/crearempleado"}>
          <ToolTip text="Registrar Nuevo Empleado">
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
              {empleados ? <SimpleTable data={empleados} columns={columns} filterInput={true} botonera={true} /> : ""}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReporteEmpleados;

//onClick={() => navigate(`/cliente/${cliente._id}/edit`)}
