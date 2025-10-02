import React from "react";
import DataTable, { type TableColumn } from "react-data-table-component";

// Minimal wrapper that forwards all props to react-data-table-component.
// No extra UI (no filters, no CSV, etc.).
// Just keeps a sensible theme default and preserves any props you pass in.

type Row = Record<string, any>;

interface DataTableBaseProps<T extends Row = Row> {
  columns: TableColumn<T>[];
  data: T[];
  // Forward any additional DataTable props
  [key: string]: any;
}

export default function DataTableBase<T extends Row = Row>({ columns, data, ...rest }: DataTableBaseProps<T>) {
  const theme =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("class") === "dark"
      ? "dark"
      : "default";

  return (
    <DataTable
      columns={columns as any}
      data={data}
      // provide a default theme if one isn't provided
      theme={rest.theme ?? theme}
      // keep a default border class but allow additional classNames
      className={`border border-gray-200 ${rest.className ?? ""}`}
      {...rest}
    />
  );
}
