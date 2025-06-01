// DraggablePanel.tsx
import { useDraggable } from "@dnd-kit/core";
import { ComponentData, ComponentType } from "../types";

const components: {
  id: string;
  type: ComponentType;
  label: string;
  extraProps?: Partial<ComponentData>;
}[] = [
  { id: "sidebar-text", type: "text", label: "Text Label" },
  { id: "sidebar-input", type: "input", label: "Text Input" },
  { id: "sidebar-select", type: "select", label: "Select Dropdown" },
  { id: "sidebar-button", type: "button", label: "Button" },
  { id: "sidebar-textarea", type: "textarea", label: "Textarea" },
  { id: "sidebar-checkbox", type: "checkbox", label: "Checkbox" },
  { id: "sidebar-radio", type: "radio", label: "Radio" },
];

const DraggableItem = ({
  id,
  label,
  onClick,
}: {
  id: string;
  label: string;
  type: ComponentType;
  extraProps?: Partial<ComponentData>;
  onClick: () => void;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      data-id={id}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className="cursor-move px-4 py-2 rounded-md bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition-colors duration-150 border border-gray-200 hover:border-blue-400 text-sm font-medium text-gray-800"
    >
      {label}
    </div>
  );
};

export default function DraggablePanel({
  onAddComponent = () => {},
}: {
  onAddComponent?: (newComponent: { id: string; label: string }) => void;
}) {
  return (
    <aside className="w-64 h-full p-4 bg-gray-100 border-r border-gray-300 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">📦 Components</h2>
      <div className="space-y-2">
        {components.map((comp) => (
          <DraggableItem
            key={comp.id}
            id={comp.id}
            type={comp.type}
            label={comp.label}
            extraProps={comp.extraProps}
            onClick={() =>
              onAddComponent?.({
                id: comp.type,
                label: comp.label,
                ...comp.extraProps,
              })
            }
          />
        ))}
      </div>
    </aside>
  );
}
