import React, { use, useEffect, useState } from "react";
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
  
  const [pending, setPending] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRows(data);
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [data]);
  
  const theme =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("class") === "dark"
      ? "dark"
      : "default";
  
  const dense = true; // Change to metadata stuff


  return (
    <DataTable
      columns={columns as any}
      data={data}
      // provide a default theme if one isn't provided
      dense={rest.dense ?? dense}
      theme={rest.theme ?? theme}
      // keep a default border class but allow additional classNames
      className={`border border-gray-200 ${rest.className ?? ""}`}
      {...rest}

      // sensible defaults for usability and repeatability
      fixedHeader
      pointerOnHover
      highlightOnHover
      progressPending={pending}
    />
  );
}
