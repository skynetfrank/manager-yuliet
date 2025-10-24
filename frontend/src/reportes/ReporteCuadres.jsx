import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import SimpleTable from "../components/SimpleTable";
import { groupByDay } from "../actions/orderActions";
import { LucideBadgeDollarSign, LucideHammer } from "lucide-react";

function ReporteCuadres() {
  const navigate = useNavigate("");
  const dispatch = useDispatch();

  const groupDay = useSelector((state) => state.orderGroupDay);
  const { loading, dailyOrders, error } = groupDay;

  useEffect(() => {
    dispatch(groupByDay());
  }, [dispatch]);

  const parseFecha = (fecha) => {
    const dia = fecha.toString().substr(8, 2);
    const mes = fecha.toString().substr(5, 2);
    const ano = fecha.toString().substr(0, 4);
    const xfecha = dia + "-" + mes + "-" + ano;
    return xfecha;
  };

  const columns = [
    {
      header: "Dia",
      accessorKey: "_id",
      cell: (value) => {
        return parseFecha(new Date(value.getValue()).toISOString());
      },
    },
    { header: "Ventas", accessorKey: "orders" },
    {
      header: "Monto US$",
      accessorKey: "sales",
      cell: (value) => {
        return "$" + Number(value.getValue()).toFixed(2);
      },
    },

    {
      header: "Acciones",
      accessorKey: "_id",
      cell: (value) => {
        const { _id } = value.row.original;
        return (
          <div className="flx pad-0">
            {" "}
            <button className="btn-icon-container" onClick={() => navigate(`/cuadreventas/${_id}`)}>
              <LucideBadgeDollarSign />
              <p className="negrita azul-marino font-1">Reporte</p>
            </button>
            <button className="btn-icon-container" onClick={() => navigate(`/cuadrecaja/${_id}`)}>
              <LucideHammer />
              <p className="negrita azul-marino font-1">Caja</p>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flx jcenter">
        <h2 className="centrado">Reporte de Ventas Diarias</h2>
      </div>

      {loading ? (
        <span>descargando datos del Servidor...</span>
      ) : (
        <>
          <div>
            <div>
              {dailyOrders ? (
                <SimpleTable data={dailyOrders} columns={columns} filterInput={false} botonera={true} />
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
