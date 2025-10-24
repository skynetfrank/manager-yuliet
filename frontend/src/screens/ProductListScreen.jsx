import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import ToolTip from "../components/ToolTip";
import { LucideArrowUp10, LucideEdit, LucideFilePlus, LucideTrash2 } from "lucide-react";
import { useGetProductsQuery, useDeleteProductMutation } from "../api/productosApi";
import TanstackTable from "../components/TanstackTable";

export default function ProductListScreen() {
  const { data, isLoading } = useGetProductsQuery();
  const navigate = useNavigate("");

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const editHandler = (id) => {
    if (!userInfo.isAdmin) {
      Swal.fire({
        title: "Necesita Permisos de Administrador",
        text: "Editar Producto ",
        icon: "warning",
      });
      return "";
    }
    navigate(`/product/${id}/edit`);
  };

  const deleteHandler = async (id, codigo) => {
    if (!userInfo.isAdmin) {
      return Swal.fire({
        title: "Necesita Permisos de Administrador",
        text: "Eliminar Producto",
        icon: "warning",
      });
    }

    const result = await Swal.fire({
      title: `¿Estás seguro de eliminar ${codigo}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire("Eliminado", `El producto ${codigo} ha sido eliminado.`, "success");
      } catch (error) {
        Swal.fire("Error", `No se pudo eliminar el producto. ${error.data?.message || ""}`, "error");
      }
    }
  };

  const columns = [
    {
      header: "Codigo",
      accessorKey: "codigo",
      enableGrouping: false,
      cell: (info) => {
        const { codigo, _id, nombre } = info.row.original;

        return (
          <div className="flx pad-0 column">
            <h3>{codigo}</h3>
            {userInfo.email === "frank.uah@gmail.com" ? (<div className="flx gap-1 bg-grey pad-05">
              <ToolTip text="Editar">
                <LucideEdit size={20} onClick={() => editHandler(_id)} />
              </ToolTip>
              <ToolTip text="Conteo Rapido">
                <LucideArrowUp10 size={20} onClick={() => navigate(`/conteorapido/${_id}`)} />
              </ToolTip>
              <ToolTip text="Eliminar">
                <LucideTrash2 size={20} onClick={() => deleteHandler(_id, codigo)} disabled={isDeleting} />
              </ToolTip>
            </div>) : ("")}

          </div>
        );
      },
      aggregationFn: "count",
    },
    {
      header: "Imagen",
      accessorKey: "imageurl",
      enableGrouping: false,
      enableSorting: true,
      cell: (info) => {
        return <img className="table-img" src={info.getValue() || "./src/assets/logo.png"} loading="lazy" />;
      },
    },

    {
      header: "Precio",
      accessorKey: "preciousd",
      aggregatedCell: ({ getValue }) => Math.round(getValue() * 100) / 100,
      aggregationFn: "median",
      cell: (info) => {
        return "$" + Number(info.getValue()).toFixed(2);
      },
      footer: ({ table }) => {
        const unidades = table
          .getFilteredRowModel()
          .rows.reduce((total, row) => total + row.getValue("existencia") * row.getValue("preciousd"), 0);
        return unidades;
      },
    },
    { header: "Marca", accessorKey: "marca" },
    { header: "Modelo", accessorKey: "modelo" },
    { header: "Color", accessorKey: "color" },
    { header: "Genero", accessorKey: "genero" },
    {
      header: "Existencia",
      accessorKey: "existencia",
      footer: ({ table }) =>
        "Unidades: " + table.getFilteredRowModel().rows.reduce((total, row) => total + row.getValue("existencia"), 0),
    },
    {
      header: "Tallas",
      accessorKey: "tallas",
      enableGrouping: false,
      enableSorting: false,

      cell: (info) => {
        const { tallas } = info.row.original;
        if (tallas === undefined) {
          return "";
        }
        const stock = Object.values(tallas).reduce((total, x) => total + x, 0);

        if (!tallas) {
          return "";
        }
        return stock <= 0 ? (
          <span className="negrita">No Disponible</span>
        ) : (
          <div className="flx column pad-0 font-x negrita azul-brand">
            <div className="flx jcenter pad-0 mtop-1">
              {Object.keys(tallas).map((key, index) => {
                if (tallas[key] === 0) {
                  return "";
                }

                return (
                  <div className="flx column astart pad-0 font-14" key={index}>
                    <p className="centrado minw-20 negrita subrayado">{key}</p>
                    <p className="centrado minw-20 font-12 color-negro">{tallas[key]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      },
      footer: "",
    },
  ];

  return (
    <div>
      <div className="flx column jcenter mtop-1">
        <h2 className="centrado">PRODUCTOS</h2>
        <p className="negrita">Almacen Principal</p>
      </div>
      {isLoading ? (
        <Loader txt="Actualizando Productos" />
      ) : (
        <div>{data.length > 0 ? <TanstackTable data={data} columns={columns} /> : ""}</div>
      )}
    </div>
  );
}
