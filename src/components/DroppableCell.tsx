// import { useDroppable } from "@dnd-kit/core";
// import { ComponentData } from "../types";
// import { SortableComponent } from "./DraggableComponent";

// interface DroppableCellProps {
//   row: number;
//   col: number;
//   components: ComponentData[];
//   selectedId: string | null;
//   updateComponent: (id: string, updates: Partial<ComponentData>) => void;
//   setSelectedId: (id: string | null) => void;
//   previewMode: boolean;
//   cellWidth: number;
//   cellHeight: number;
//   totalRows: number;
//   totalColumns: number;
// }

// export function DroppableCell({
//   row,
//   col,
//   components,
//   selectedId,
//   updateComponent,
//   setSelectedId,
//   previewMode,
//   cellWidth,
//   cellHeight,
// //   totalRows,
// //   totalColumns,
// }: DroppableCellProps) {
//   const { isOver, setNodeRef } = useDroppable({ id: `cell-${row}-${col}` });

//   // Filter components that start at this cell
//   const cellComponents = components.filter(
//     (c) => c.gridPosition?.row === row && c.gridPosition?.col === col
//   );

//   return (
//     <div
//       ref={setNodeRef}
//       style={{
//         backgroundColor: isOver ? "#e0f7ff" : "transparent",
//         position: "relative",
//       }}
//       className="border border-dashed border-gray-300"
//     >
//       {cellComponents.map((comp) => (
//         <SortableComponent
//           key={comp.id}
//           component={comp}
//           isSelected={selectedId === comp.id}
//           updateComponent={updateComponent}
//           onClick={() => !previewMode && setSelectedId(comp.id)}
//           previewMode={previewMode}
//           cellWidth={cellWidth}
//           cellHeight={cellHeight}
//         />
//       ))}
//     </div>
//   );
// }
