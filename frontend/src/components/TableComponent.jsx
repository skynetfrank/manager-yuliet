import { useState } from "react";
import {
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  getSortedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import {
  CircleMinus,
  CirclePlus,
  LucideChevronFirst,
  LucideChevronLast,
  LucideChevronLeft,
  LucideChevronRight,
  LucideListRestart,
} from "lucide-react";

function TableComponent({ data, columns, title = "Tabla de Datos" }) {
  const [grouping, setGrouping] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    },

    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
  });

  const categoryColumn = table.getColumn("category");
  const uniqueValuesMap = categoryColumn?.getFacetedUniqueValues();
  const uniqueCategories = uniqueValuesMap ? Array.from(uniqueValuesMap.keys()).sort() : [];

  const resetHandler = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    setGrouping([]);
    setSorting([]);
    setPagination({ pageIndex: 0, pageSize: 20 });
  };
  return (
    <div className="tankstack-table-container">
      <div className="table-controls">
        <h2>{title}</h2>
        <div className="search-input-container">
          <input
            type="text"
            className="mr"
            value={globalFilter ?? ""}
            placeholder="Buscar"
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="group-select-container">
          <select value={grouping[0] || ""} onChange={(e) => setGrouping(e.target.value ? [e.target.value] : [])}>
            <option value="">Agrupar</option>
            <option value="category">Categoria</option>
            <option value="brand">Marca</option>
            <option value="modelo">Modelo</option>
            <option value="color">Color</option>
            <option value="genero">Genero</option>
          </select>
        </div>
        <div className="group-select-container">
          <select
            className="control-select"
            value={table.getColumn("category")?.getFilterValue() ?? ""}
            onChange={(e) => table.getColumn("category")?.setFilterValue(e.target.value || undefined)}
          >
            <option value="">categorias</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <LucideListRestart
            onClick={() => {
              resetHandler();
            }}
          />
        </div>
      </div>
      <div>
        <table className="table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted()] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {cell.getIsGrouped() ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <button
                              {...{
                                onClick: row.getToggleExpandedHandler(),
                              }}
                              className="td-group-btn"
                            >
                              {row.getIsExpanded() ? <CircleMinus /> : <CirclePlus className="td-group-icon" />}{" "}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())} ({row?.subRows?.length})
                            </button>
                          </>
                        ) : cell.getIsAggregated() ? (
                          // If the cell is aggregated, use the Aggregated
                          // renderer for cell
                          flexRender(
                            cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                          // Otherwise, just render the regular cell
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <th key={footer.id}>{flexRender(footer.column.columnDef.footer, footer.getContext())}</th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        <div className="pagination-container">
          <LucideChevronFirst onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} />

          <LucideChevronLeft
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          />
          <LucideChevronRight onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
          <LucideChevronLast onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />

          <span className="font-x negrita">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;
