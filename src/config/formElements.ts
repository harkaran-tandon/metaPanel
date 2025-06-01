// config/formElements.ts

export const AVAILABLE_FIELDS = [
    {
      type: "text",
      label: "Text Input",
      defaultProps: {
        label: "Text Field",
        name: "textField",
        placeholder: "Enter text",
        validation: { required: true }
      }
    },
    {
      type: "number",
      label: "Number Input",
      defaultProps: {
        label: "Number Field",
        name: "numberField",
        placeholder: "Enter number",
        validation: { required: true, min: 0 }
      }
    },
    {
      type: "select",
      label: "Select Box",
      defaultProps: {
        label: "Select Field",
        name: "selectField",
        options: ["Option 1", "Option 2"],
        validation: { required: true }
      }
    }
  ];
  