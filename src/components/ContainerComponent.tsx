import { useDroppable } from "@dnd-kit/core";
import { ComponentData } from "../types";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableComponent } from "./DraggableComponent";

type RenderComponentTreeProps = {
  comp: ComponentData;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  previewMode: boolean;
  children?: React.ReactNode;
  selectedId?: string | null;
  setSelectedId: (id: string | null) => void;
};

const ContainerComponent = ({ comp, selectedId, setSelectedId, previewMode, updateComponent }: RenderComponentTreeProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: comp.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex ${
        comp.layout === "row" ? "flex-row" : "flex-col"
      } gap-2 p-2 border-2 rounded bg-amber-400 transition-all ${
        isOver ? "border-blue-500" : "border-gray-300"
      }`}
    >
      <span className="text-xs text-gray-800 italic mb-1">
        [Container: {comp.layout}]
      </span>

      <SortableContext
        items={(comp.children || []).map(child => child.id)}
        strategy={rectSortingStrategy}
      >
        {(comp.children || []).map(child => (
          <div key={child.id} className="flex-shrink-0">
            <RenderComponentTree
              comp={child}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              previewMode={previewMode}
              updateComponent={updateComponent}
            />
          </div>
        ))}
      </SortableContext>
    </div>
  );
};

export const RenderComponentTree = ({ comp, selectedId, setSelectedId, previewMode, updateComponent }: RenderComponentTreeProps) => {
  if (comp.type === "container") {
    return (
      <SortableComponent
        key={comp.id}
        component={comp}
        isSelected={selectedId === comp.id}
        updateComponent={updateComponent}
        previewMode={previewMode}
        onClick={() => !previewMode && setSelectedId(comp.id)}
      >
        <ContainerComponent
          comp={comp}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          previewMode={previewMode}
          updateComponent={updateComponent}
          />
      </SortableComponent>
    );
  }

  return (
    <SortableComponent
      key={comp.id}
      component={comp}
      isSelected={selectedId === comp.id}
      updateComponent={updateComponent}
      previewMode={previewMode}
      onClick={() => !previewMode && setSelectedId(comp.id)}
    />
  );
};

