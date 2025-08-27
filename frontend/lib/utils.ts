import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {Row} from "@tanstack/table-core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function compareInLowercase<T>(
  rowA: Row<T>,
  rowB: Row<T>,
  columnId: string
): number {
  const a = String(rowA.getValue(columnId)).toLowerCase();
  const b = String(rowB.getValue(columnId)).toLowerCase();

  return a.localeCompare(b);
}
