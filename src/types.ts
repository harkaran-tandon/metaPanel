export type FieldType =
  | "text"
  | "select"
  | "input"
  | "button"
  | "textarea"
  | "checkbox"
  | "radio";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
}

export interface FormConfig {
  fields: FormFieldConfig[];
}

export type ComponentType =
  | "text"
  | "select"
  | "input"
  | "button"
  | "textarea"
  | "checkbox"
  | "radio"
  | "container";

export type ComponentData = {
  id: string;
  type: ComponentType;
  label: string;
  options: Array<{ label: string; value: string; selected?: boolean }>;
  placeholder?: string;
  checked?: boolean;
  apiUrl?: string;        // e.g. "https://api.example.com/items"
  apiMethod?: "GET" | "POST" | "PUT" | "DELETE";
  apiHeaders?: Record<string, string>;
  width?: number;
  height?: number;
  layout?: 'row' | 'column'
  children?: ComponentData[]
  gridPosition: { row: number; col: number };
  rowSpan?: number | 2;
  colSpan?: number | 2; 
};

export type BuilderConfig = {
  id: string;
  name: string;
  components: ComponentData[];
  createdAt: string;
  grid?: {
    rows: number;
    columns: number;
  };
};