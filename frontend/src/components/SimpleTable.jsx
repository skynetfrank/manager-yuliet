import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { useState } from "react";
import ToolTip from "./ToolTip";

function SimpleTable({ data, columns, filterInput, botonera, filterValue, filas }) {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState(filterValue);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: filas || 20 });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    onPaginationChange: setPagination,
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, inx) => (
                <td key={inx}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
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
