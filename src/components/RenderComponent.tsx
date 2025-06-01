// src/components/RenderComponent.tsx
import { ComponentData } from "../types";

export function RenderComponent({ component }: { component: ComponentData }) {
  switch (component.type) {
    case "text":
      return <span>{component.label}</span>;

    case "textarea":
      return (
        <textarea
          className="w-full h-full resize-none overflow-auto outline-none"
          placeholder={component.placeholder}
          disabled
        />
      );

      case "input":
      return (
        <input
          type="text"
          className="w-full px-2 py-1 border rounded outline-none"
          placeholder={component.placeholder}
          disabled
        />
      );

    case "checkbox":
      return (
        <label>
          <input type="checkbox" checked={component.checked} readOnly />{" "}
          {component.label}
        </label>
      );

    case "radio":
      return (
        <label>
          <input type="radio"  disabled checked={component.checked} readOnly />{" "}
          {component.label}
        </label>
      );

    case "select":
      return (
        <select
          disabled
          value={component.options?.find(o => o.selected)?.value}
          className="border px-2 py-1 rounded w-full"
        >
          <option value="" disabled hidden>{component.placeholder}</option>
          {component.options?.map((option, idx) => (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    case "button":
      return (
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-1 rounded cursor-not-allowed opacity-50"
          disabled
        >
          {component.label}
        </button>
      );

    default:
      return null;
  }
}