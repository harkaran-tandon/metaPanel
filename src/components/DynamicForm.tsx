import React from 'react';
import { useForm } from 'react-hook-form';
import { z, ZodType, ZodObject } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from './FormField';
import { BuilderConfig } from '../types';

interface DynamicFormProps {
  config: BuilderConfig;
  formRef: React.RefObject<HTMLFormElement | null>;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ config, formRef }) => {

  const schemaFields: Record<string, ZodType<any>> = {};

  config.components.forEach((field) => {
    let schema: ZodType<any>;

    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'input':
        schema = z.string();
        break;
      case 'checkbox':
        schema = z.boolean();
        break;
      case 'select':
      case 'radio':
        schema = z.string();
        break;
      default:
        schema = z.any();
    }

    schemaFields[field.id] = schema;
  });

  const schema: ZodObject<any> = z.object(schemaFields);

  const {
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: config.components.reduce((acc, field) => {
      acc[field.id] = field.type === 'checkbox' ? !!field.checked : '';
      return acc;
    }, {} as Record<string, any>),
  });
  
  return (
    <div>
      <form
        ref={formRef}
        className="grid grid-cols-2 gap-4 bg-[#1E2A38] p-4 rounded"
        noValidate
      >
        {config.components.map((field) => (
          <div
            key={field.id}
            className={`col-span-${field.colSpan ?? 1} row-span-${field.rowSpan ?? 1}`}
            style={{
              gridColumnStart: field.gridPosition.col,
              gridRowStart: field.gridPosition.row,
            }}
          >
            <FormField field={field} register={register} errors={errors} />
          </div>
        ))}
      </form>
    </div>
  );
};

export default DynamicForm;
