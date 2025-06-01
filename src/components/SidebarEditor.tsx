import { useState } from "react";
import { ComponentData } from "../types";

export function SidebarEditor({
  selectedComponent,
  updateComponent,
  clearSelection,
}: {
  selectedComponent: ComponentData;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  removeComponent: (id: string) => void;
  clearSelection: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    key: keyof ComponentData,
    value:
      | string
      | boolean
      | Record<string, string>
      | Array<{ label: string; value: string; selected?: boolean }>
  ) => {
    if (key === "label" && typeof value === "string" && value.trim() === "") {
      setError("Label cannot be empty");
      return;
    }
    setError(null);
    updateComponent(selectedComponent.id, { [key]: value });
  };

  return (
    <aside
      className="w-full h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-6 space-y-6 shadow-xl overflow-auto text-gray-900 dark:text-gray-100"
      role="region"
      aria-label="Component editor panel"
    >
      <h3 className="text-xl font-semibold">Edit Component</h3>

      {error && <div className="text-red-500 font-medium">{error}</div>}

      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="label-input">
          Label
        </label>
        <input
          id="label-input"
          value={selectedComponent.label}
          onChange={(e) => handleChange("label", e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-invalid={!!error}
        />
      </div>

      {["text", "input", "textarea", "select"].includes(selectedComponent.type) && (
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="placeholder-input">
            Placeholder
          </label>
          <input
            id="placeholder-input"
            value={selectedComponent.placeholder || ""}
            onChange={(e) => handleChange("placeholder", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {selectedComponent.type === "select" && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Select Options</h4>
          {selectedComponent.options?.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Label"
                value={option.label}
                onChange={(e) => {
                  const newOptions = [...(selectedComponent.options || [])];
                  newOptions[index].label = e.target.value;
                  handleChange("options", newOptions);
                }}
                className="w-1/3 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="Value"
                value={option.value}
                onChange={(e) => {
                  const newOptions = [...(selectedComponent.options || [])];
                  newOptions[index].value = e.target.value;
                  handleChange("options", newOptions);
                }}
                className="w-1/3 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none"
              />
              <input
                type="radio"
                name="selectedOption"
                checked={option.selected || false}
                onChange={() => {
                  const newOptions = (selectedComponent.options || []).map((opt, i) => ({
                    ...opt,
                    selected: i === index,
                  }));
                  handleChange("options", newOptions);
                }}
                title="Mark as selected"
              />
              <button
                className="text-red-500 text-xs hover:underline"
                onClick={() => {
                  const newOptions = [...(selectedComponent.options || [])];
                  newOptions.splice(index, 1);
                  handleChange("options", newOptions);
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={() => {
              const newOptions = [
                ...(selectedComponent.options || []),
                { label: "", value: "", selected: false },
              ];
              handleChange("options", newOptions);
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Option
          </button>
        </div>
      )}

      {["checkbox", "radio"].includes(selectedComponent.type) && (
        <div className="flex items-center gap-2">
          <input
            id="checked-input"
            type="checkbox"
            checked={!!selectedComponent.checked}
            onChange={(e) => handleChange("checked", e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
          />
          <label htmlFor="checked-input" className="text-sm font-medium">
            Checked
          </label>
        </div>
      )}

      <button
        className="text-sm text-red-600 hover:underline mt-6"
        onClick={clearSelection}
        aria-label="Close editor"
      >
        ✕ Close Editor
      </button>
    </aside>
  );
}
