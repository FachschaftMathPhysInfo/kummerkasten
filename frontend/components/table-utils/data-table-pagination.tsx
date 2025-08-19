import {Table} from "@tanstack/react-table"
import {ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  disableElementsPerPage?: boolean
}

export function DataTablePagination<TData>({
                                             table,
                                             disableElementsPerPage = false,
                                           }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2 w-full">
      <div className="flex items-center w-full justify-between space-x-6 lg:space-x-8">
        {!disableElementsPerPage && (
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Elemente pro Seite</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize}/>
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex w-[100px] items-center justify-center text-sm text-muted-foreground font-medium">
          Seite {table.getState().pagination.pageIndex + 1} von {" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft/>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft/>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight/>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight/>
          </Button>
        </div>
      </div>
    </div>
  )
}
