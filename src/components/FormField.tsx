import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface Field {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  options?: { label: string; value: string; selected?: boolean }[];
}

interface FormFieldProps {
  field: Field;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

const FormField: React.FC<FormFieldProps> = ({ field, register, errors }) => {
  const { id, label, type, placeholder, options } = field;
  const error = errors[id]?.message as string | undefined;

  const commonInputClasses =
    'w-full bg-[#1E2A38] text-white border border-gray-600 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150';

  return (
    <div className="mb-4">
      {type !== 'checkbox' && (
        <label htmlFor={id} className="block text-white font-medium mb-1">
          {label}
        </label>
      )}

      {type === 'textarea' ? (
        <textarea
          id={id}
          {...register(id)}
          placeholder={placeholder}
          className={commonInputClasses}
        />
      ) : type === 'select' ? (
        <select id={id} {...register(id)} className={commonInputClasses}>
          {options?.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label || option.value}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            id={id}
            type="checkbox"
            {...register(id)}
            className="mr-2 accent-blue-500"
          />
          <label htmlFor={id} className="text-white">
            {label}
          </label>
        </div>
      ) : (
        <input
          id={id}
          type={type === 'input' ? 'text' : type}
          {...register(id)}
          placeholder={placeholder}
          className={commonInputClasses}
        />
      )}

      {error && <p className="text-red-400 font-medium text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
