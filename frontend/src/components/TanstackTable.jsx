import React, { useState } from "react";
import ToolTip from "../components/ToolTip";
import {
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getCoreRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  flexRender,
  getSortedRowModel,
} from "@tanstack/react-table";

import { LucideArrowUpNarrowWide, LucideCircleMinus, LucideCirclePlus, LucideCircleX, LucideCog } from "lucide-react";

function TanstackTable({ data, columns }) {
  const [grouping, setGrouping] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState([]);

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
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <div className="tankstack-table-container">
      <div className="flx pad-0 jcenter">
        <input
          type="text"
          className="mr"
          value={globalFilter}
          placeholder="Buscar"
          onChange={(e) => setGlobalFilter(e.target.value)}
        />

        <span className="font-x negrita">
          Pagina {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
      </div>
      <div>
        <table className="styled-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div className="flx pad-0 gap05 jcenter">
                          {header.column.getCanGroup() ? (
                            // If the header can be grouped, let's add a toggle
                            <ToolTip text="agrupar">
                              <button
                                {...{
                                  onClick: header.column.getToggleGroupingHandler(),
                                  style: {
                                    cursor: "pointer",
                                    backgroundColor: "transparent",
                                    border: "none",
                                  },
                                }}
                                className={header.column.getIsGrouped() ? "th-ungroup-btn" : "th-group-btn"}
                              >
                                {header.column.getIsGrouped() ? (
                                  <LucideCircleX style={{ color: "grey" }} />
                                ) : (
                                  <LucideCog style={{ color: "grey" }} />
                                )}
                              </button>
                            </ToolTip>
                          ) : null}{" "}
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <ToolTip text="ordenar">
                            <button
                              {...{
                                style: {
                                  cursor: "pointer",
                                  backgroundColor: "transparent",
                                  border: "none",
                                  minWidth: "20px",
                                  padding: 0,
                                  margin: "0",
                                },
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted()] ?? <LucideArrowUpNarrowWide />}
                            </button>
                          </ToolTip>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, inx) => {
                    return (
                      <td
                        key={inx}
                        {...{
                          style: {
                            background: cell.getIsGrouped()
                              ? "#dedede"
                              : cell.getIsAggregated()
                              ? "#bebdbd"
                              : cell.getIsPlaceholder()
                              ? "#bebdbd"
                              : "white",
                          },
                        }}
                      >
                        {cell.getIsGrouped() ? (
                          // If it's a grouped cell, add an expander and row count
                          <>
                            <button
                              {...{
                                onClick: row.getToggleExpandedHandler(),
                                style: {
                                  cursor: row.getCanExpand() ? "pointer" : "normal",
                                },
                              }}
                              className="td-group-btn"
                            >
                              {row.getIsExpanded() ? <LucideCircleMinus /> : <LucideCirclePlus className="td-group-icon" />}{" "}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())} ({row.subRows.length})
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
        <div className="tankstack-pagination-container">
          <div className="tankstack-pagination-botonera">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              {"primero"}
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              {"anterior"}
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {"siguiente"}
            </button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              {"ultimo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TanstackTable;
