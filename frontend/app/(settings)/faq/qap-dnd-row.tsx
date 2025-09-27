import {ColumnDef, flexRender, type Row as TanStackRow} from "@tanstack/react-table";
import {QuestionAnswerPair} from "@/lib/graph/generated/graphql";
import {useRef} from "react";
import {useDrag, useDrop} from "react-dnd";
import {TableCell, TableRow} from "@/components/ui/table";

type QAPColumnDef<TData> = ColumnDef<TData> & {
  className?: string;
};

interface DragItem {
  id: string;
  index: number;
}

export function DndTableRow({
                              row,
                              moveRow,
                              savePosition,
                            }: {
  row: TanStackRow<QuestionAnswerPair>;
  moveRow: (draggedId: string, toIndex: number) => void;
  savePosition: (draggedId: string) => void;
}) {
  const {original} = row;
  const dropRef = useRef<HTMLTableRowElement | null>(null);
  const dragHandleRef = useRef<HTMLDivElement | null>(null);

  const [{handlerId, isOver}, drop] = useDrop<
    DragItem,
    void,
    {handlerId: string | symbol | null; isOver: boolean}
  >({
    accept: "row",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      };
    },
    hover(item: DragItem) {
      const dragIndex = item.index;
      const hoverIndex = row.index;
      if (dragIndex === hoverIndex) return;

      moveRow(item.id, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{isDragging}, drag, preview] = useDrag({
    type: "row",
    item: () => ({id: original.id, index: row.index}),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) return;
      savePosition(item.id);
    },
  });

  drop(dropRef);
  preview(dropRef);
  drag(dragHandleRef);

  const handlerIdAttr = handlerId ?? undefined;

  return (
    <TableRow
      ref={dropRef}
      style={{opacity: isDragging ? 0 : 1}}
      className={`${isDragging ? "shadow-lg bg-background cursor-grabbing" : ""} ${
        isOver ? "bg-accent/20 border-t-2 border-b-2 border-primary" : ""
      }`}
      data-handler-id={handlerIdAttr}
      data-cy="qap-row"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={`whitespace-normal break-words px-4 py-3 ${
            ((cell.column.columnDef as QAPColumnDef<QuestionAnswerPair>).className) ?? ""
          }`}
        >
          {cell.column.id === "drag-handle" ? (
            <div ref={dragHandleRef} className="cursor-grab">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}
