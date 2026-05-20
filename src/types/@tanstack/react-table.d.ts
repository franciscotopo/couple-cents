/* eslint-disable @typescript-eslint/consistent-type-definitions -- Overriding interfaces for Meta types */
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    stringifiedHeader?: string;
  }
  interface TableMeta {
    totalItems: number;
  }
}
