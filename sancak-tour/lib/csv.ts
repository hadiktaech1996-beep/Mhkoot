/** CSV with spreadsheet-formula-injection protection (cells starting with = + - @ are neutralised). */
export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const cell = (v: unknown) => {
    let s = v == null ? "" : String(v);
    // Neutralise spreadsheet formulas; plain phone/number-looking values (e.g. +49 151 123) stay untouched.
    if (/^[=+\-@\t\r]/.test(s) && !/^[+-]?[\d\s()-]+$/.test(s)) s = "'" + s;
    return `"${s.replace(/"/g, '""')}"`;
  };
  return "﻿" + [columns.map(cell).join(","), ...rows.map((r) => columns.map((c) => cell(r[c])).join(","))].join("\r\n");
}
