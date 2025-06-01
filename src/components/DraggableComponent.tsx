import React, { useState, useEffect, useRef } from "react";
import { CSS } from "@dnd-kit/utilities";
import { ComponentData } from "../types";
import { useDraggable, useDndContext } from "@dnd-kit/core";
import { TrashIcon } from "@heroicons/react/24/outline"; // Optional: Replace with your icon set
import { RenderComponent } from "./RenderComponent";

type Props = {
  component: ComponentData;
  isSelected: boolean;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  onClick: () => void;
  previewMode: boolean;
  cellWidth: number;
  cellHeight: number;
  clearSelection: () => void;
  removeComponent: () => void;
};

type ResizeDirection =
  | "right"
  | "bottom"
  | "bottom-right"
  | "left"
  | "top"
  | "top-left"
  | "top-right"
  | "bottom-left";

export function DraggableComponent({
  component,
  isSelected,
  updateComponent,
  onClick,
  previewMode,
  cellWidth,
  cellHeight,
  clearSelection,
  removeComponent,
}: Props) {
  const colSpan = component.colSpan ?? 2;
  const rowSpan = component.rowSpan ?? 2;
  const { active } = useDndContext();
  const isDragging = active?.id === component.id;

  const [resizing, setResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<ResizeDirection | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [startSpan, setStartSpan] = useState({ colSpan, rowSpan });
  const [ghostSpan, setGhostSpan] = useState<{ colSpan: number; rowSpan: number } | null>(null);
  const [draggingDisable, setDraggingdisable] = useState(false);
  const dragStarted = useRef(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: component.id,
    disabled: resizing || isSelected || draggingDisable,
  });

  const onMouseMove = (e: MouseEvent) => {
    if (!resizing || !startPos) return;

    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    let newColSpan = startSpan.colSpan;
    let newRowSpan = startSpan.rowSpan;

    if (resizeDir) {
      if (resizeDir.includes("right")) {
        newColSpan = Math.max(1, Math.round((dx + startSpan.colSpan * cellWidth) / cellWidth));
      }
      if (resizeDir.includes("left")) {
        newColSpan = Math.max(1, Math.round((startSpan.colSpan * cellWidth - dx) / cellWidth));
      }
      if (resizeDir.includes("bottom")) {
        newRowSpan = Math.max(1, Math.round((dy + startSpan.rowSpan * cellHeight) / cellHeight));
      }
      if (resizeDir.includes("top")) {
        newRowSpan = Math.max(1, Math.round((startSpan.rowSpan * cellHeight - dy) / cellHeight));
      }
    }

    updateComponent(component.id, {
      colSpan: newColSpan,
      rowSpan: newRowSpan,
    });

    setGhostSpan({ colSpan: newColSpan, rowSpan: newRowSpan });
  };

  const onMouseUp = () => {
    if (!resizing || !ghostSpan) return;
    setResizing(false);
    setResizeDir(null);
    setStartPos(null);
    setGhostSpan(null);
  };

  useEffect(() => {
    if (resizing) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [resizing, ghostSpan, startPos, resizeDir]);

  const startResize = (direction: ResizeDirection, e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewMode) return;

    setResizing(true);
    setResizeDir(direction);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSpan({ colSpan, rowSpan });
  };

  const style: React.CSSProperties = {
    gridColumnStart: component.gridPosition.col,
    gridRowStart: component.gridPosition.row,
    gridColumnEnd: `span ${component.colSpan}`,
    gridRowEnd: `span ${component.rowSpan}`,
    width: cellWidth * (component.colSpan ?? 1),
    height: cellHeight * (component.rowSpan ?? 1) + 8 * (rowSpan - 1),
    boxSizing: "border-box",
    zIndex: isDragging ? 1000 : 10,
    position: "relative",
    userSelect: resizing ? "none" : undefined,
    cursor: isDragging ? "grabbing" : undefined,
    transform: isDragging ? CSS.Transform.toString(transform) : undefined,
    transition: isDragging ? "none" : "all 150ms ease",
  };

  const handles = [
    { direction: "top-left", style: { top: 0, left: 0, cursor: "nwse-resize" } },
    { direction: "top", style: { top: 0, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" } },
    { direction: "top-right", style: { top: 0, right: 0, cursor: "nesw-resize" } },
    { direction: "right", style: { top: "50%", right: 0, transform: "translateY(-50%)", cursor: "ew-resize" } },
    { direction: "bottom-right", style: { bottom: 0, right: 0, cursor: "nwse-resize" } },
    { direction: "bottom", style: { bottom: 0, left: "50%", transform: "translateX(-50%)", cursor: "ns-resize" } },
    { direction: "bottom-left", style: { bottom: 0, left: 0, cursor: "nesw-resize" } },
    { direction: "left", style: { top: "50%", left: 0, transform: "translateY(-50%)", cursor: "ew-resize" } },
  ];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-lg border-2 transition-shadow duration-200 ${
        isSelected ? "border-blue-500 shadow-lg" : "border-gray-300 hover:shadow-md"
      }`}
      {...attributes}
      {...listeners}
      onMouseDown={(e) => {
        e.stopPropagation()
        dragStarted.current = false; // reset drag flag
        // allow drag to initiate
      }}
      onMouseMove={() => {
        console.log('hi', draggingDisable, resizing)
        dragStarted.current = true; // drag is happening
      }}
      onMouseUp={(e) => {
        console.log(dragStarted.current)
        // If drag did not occur, treat it as click
        if (!dragStarted.current) {
          e.stopPropagation();
          if (isSelected) {
            console.log('here')
            clearSelection();
            setDraggingdisable(false);
          } else {
            onClick();
          }
        }
        // else do nothing - it was a drag
      }}
    >
      <div className="relative bg-white h-[46px] rounded-md border px-3 pr-8 py-2 overflow-hidden">
  {/* Delete button */}
  <button
    onMouseEnter={() => setDraggingdisable(true)}
    onMouseLeave={() => !isSelected && setDraggingdisable(false)}
    onClick={() => {
      removeComponent();
      clearSelection();
    }}
    aria-label="Delete Component"
    className="absolute top-1 right-1 p-1 text-red-600 hover:text-red-700 z-20"
  >
    <TrashIcon className="w-4 h-4" />
  </button>

  {/* Rendered component */}
  <div className="w-full h-full flex items-center">
    <RenderComponent component={component} />
  </div>
</div>



      {!previewMode && isSelected &&
        handles.map(({ direction, style: handleStyle }) => (
          <div
            key={direction}
            onMouseDown={(e) => startResize(direction as ResizeDirection, e)}
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              backgroundColor: "#fff",
              border: "2px solid #3b82f6",
              borderRadius: "4px",
              zIndex: 100,
              ...handleStyle,
            }}
          />
        ))}

      {resizing && ghostSpan && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: ghostSpan.colSpan * cellWidth,
            height: ghostSpan.rowSpan * cellHeight,
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            pointerEvents: "none",
            border: "2px dashed #3b82f6",
            borderRadius: 6,
            zIndex: 50,
          }}
        />
      )}
    </div>
  );
}
