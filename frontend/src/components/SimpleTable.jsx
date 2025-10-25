import React, { useState, Fragment } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel, // Importar el hook para expansión
} from "@tanstack/react-table";

import ToolTip from "./ToolTip";

function SimpleTable({
  data,
  columns,
  filterInput,
  botonera,
  filterValue,
  filas,
  renderSubComponent,
  getRowCanExpand,
}) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState(filterValue);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: filas || 20 });
  const [expanded, setExpanded] = useState({}); // Estado para controlar las filas expandidas

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: filtering,
      pagination,
      expanded, // Pasar el estado de expansión a la tabla
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded, // Permite que la tabla actualice el estado
    getRowCanExpand, // Usa la prop para determinar si una fila puede expandirse
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(), // Habilita el modelo de expansión
  });

  const clearFilter = () => {
    setFiltering("");
  };

  return (
    <div className="flx column pad-0">
      {filterInput ? (
        <div className="flx pad-0">
          <input
            className="border-1 pad-05 w-200"
            type="text"
            value={filtering}
            placeholder="Buscar"
            onChange={(e) => setFiltering(e.target.value)}
          />

          <button className="close-button" onClick={clearFilter}>
            x
          </button>
        </div>
      ) : (
        ""
      )}

      <table className="styled-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: "⬆️", desc: "⬇️" }[header.column.getIsSorted() ?? null]}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr>
                {row.getVisibleCells().map((cell, inx) => (
                  <td key={inx}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
              {/* Renderiza el sub-componente si la fila está expandida */}
              {row.getIsExpanded() && renderSubComponent && (
                <tr>
                  <td colSpan={row.getVisibleCells().length}>{renderSubComponent({ row })}</td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      {botonera ? (
        <div className="botonera-reporte">
          <button className="minw-70" onClick={() => table.setPageIndex(0)}>
            primero
          </button>
          <button className="minw-70" onClick={() => table.previousPage()}>
            {"anterior"}
          </button>
          <button className="minw-70" onClick={() => table.nextPage()}>
            {"siguiente"}
          </button>
          <button className="minw-70" onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
            Ultimo
          </button>
          <span className="font-x negrita">
            Pagina {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default SimpleTable;
