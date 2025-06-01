import { SidebarEditor } from "./SidebarEditor";
import { ComponentData } from "../types";
import { useEffect, useRef, useState } from "react";
import { DraggableComponent } from "./DraggableComponent";
import { useDroppable } from "@dnd-kit/core";

type BuilderConfig = {
  id: string;
  name: string;
  components: ComponentData[];
  createdAt: string;
  grid?: {
    rows: number;
    columns: number;
  };
};

interface CanvasProps {
  config: BuilderConfig;
  previewMode: boolean;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig | null>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  gridRef: any;
}

export default function Canvas({
  previewMode,
  config,
  setConfig,
  selectedId,
  setSelectedId,
  gridRef,
}: CanvasProps) {
  const rows = config.grid?.rows || 1;
  const columns = config.grid?.columns || 1;
  const _rowCols = useRef({ rows, columns });
  const components = config?.components || [];
  const selectedComponent = components.find((c: ComponentData) => c.id === selectedId);

  const [cellWidth, setCellWidth] = useState(100);
  const cellHeight = 50;

  const sidebarRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setSelectedId("");
    }
  }

  if (selectedComponent && !previewMode) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [selectedComponent, previewMode]);

  const resize = () => {
    const rect = gridRef.current!.getBoundingClientRect();
    setCellWidth(rect.width / columns);
  };

  useEffect(() => {
    resize();
  }, []);

  useEffect(() => {
    if (rows !== _rowCols.current.rows || columns !== _rowCols.current.columns) {
      if (!gridRef.current) return;

      resize();
      _rowCols.current.rows = rows;
      _rowCols.current.columns = columns;

      const observer = new ResizeObserver(resize);
      observer.observe(gridRef.current);

      return () => observer.disconnect();
    }
  }, [columns, rows]);

  const updateComponent = (componentId: string, updates: Partial<ComponentData>) => {
    const newComponents = components.map((component: ComponentData) =>
      component.id === componentId ? { ...component, ...updates } : component
    );
    setConfig({ ...config, components: newComponents });
  };

  const removeComponent = (componentId: string) => {
    const newComponents = components.filter((c) => c.id !== componentId);
    setConfig({ ...config, components: newComponents });
    setSelectedId(selectedId !== componentId ? selectedId || "" : "");
  };

  const DroppableCell = ({ rowIdx, colIdx }: { rowIdx: number; colIdx: number }) => {
    const { isOver, setNodeRef } = useDroppable({ id: `cell-${rowIdx}-${colIdx}` });
    return (
      <div
        key={`drop-${rowIdx}-${colIdx}`}
        id={`cell-${rowIdx}-${colIdx}`}
        ref={setNodeRef}
        className={`transition-all duration-150 border border-dashed rounded-md 
          ${isOver ? "bg-blue-100 border-blue-400" : "border-slate-300 dark:border-slate-600"}`}
        style={{
          minHeight: cellHeight,
        }}
      />
    );
  };


  return (
    <div className={`${previewMode ? 'flex justify-center text-center' : ''} w-full overflow-auto px-6 py-6 relative`}>
  {/* === Sidebar Drawer === */}
  <div
  ref={sidebarRef}
  className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-slate-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
    selectedComponent && !previewMode ? "translate-x-0" : "translate-x-full"
  }`}
>
  {selectedComponent && !previewMode && (
    <div className="w-full h-full overflow-auto">
      <SidebarEditor
        selectedComponent={selectedComponent}
        updateComponent={updateComponent}
        removeComponent={removeComponent}
        clearSelection={() => setSelectedId("")}
      />
    </div>
  )}
</div>

  {/* === Main Canvas Area === */}
  <div
    ref={gridRef}
    className={`relative rounded-xl shadow-inner ${
      previewMode
        ? "border-none dark:bg-transparent"
        : "border-4 border-dashed border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-800"
    } transition-all duration-300 ease-in-out`}
    style={{ width: "82vw", height: "78vh", overflow: "auto", pointerEvents: previewMode ? "none" : "auto" }}
  >
    {/* Grid Layer */}
    {!previewMode && (
    <div
      className="overflow-auto w-full h-full grid gap-2"
      style={{
        gridTemplateRows: `repeat(${rows}, ${cellHeight}px)`,
        gridTemplateColumns: `repeat(${columns}, ${cellWidth}px)`,
        width: `${cellWidth * columns + 8 * columns}px`,
        height: `${cellHeight * rows + 8 * rows}px`,
        pointerEvents: "auto",
      }}
    >
      {Array.from({ length: rows }).map((_, rowIdx) =>
        Array.from({ length: columns }).map((_, colIdx) => (
          <DroppableCell key={`drop-${rowIdx}-${colIdx}`} rowIdx={rowIdx} colIdx={colIdx} />
        ))
      )}
    </div>)}

    {/* Draggable Components */}
    {components.map((comp) => (
      <div
        key={comp.id}
        style={{
          position: "absolute",
          width: (comp.colSpan || 1) * cellWidth,
          height: (comp.rowSpan || 1) * cellHeight,
          top: comp.gridPosition.row * cellHeight + 8 * comp.gridPosition.row,
          left: comp.gridPosition.col * cellWidth + 8 * comp.gridPosition.col,
          zIndex: 10,
          pointerEvents: previewMode ? "none" : "auto",
        }}
      >
        <DraggableComponent
          component={comp}
          isSelected={selectedId === comp.id}
          updateComponent={updateComponent}
          previewMode={previewMode}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          onClick={() => setSelectedId(comp.id)}
          clearSelection={() => setSelectedId("")}
          removeComponent={() => removeComponent(comp.id)}
        />
      </div>
    ))}
  </div>
</div>

  )
}
