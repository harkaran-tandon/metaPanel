import { formConfig } from '../config/SampleJsonConfig';
import DynamicForm from '../components/DynamicForm';

const handleFormSubmit = (data: any) => {
  console.log('Form Data:', data);
};

const FormBuilderPage = () => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dynamic Form</h1>
      <DynamicForm config={formConfig} onSubmit={handleFormSubmit} />
    </div>
  );
};

export default FormBuilderPage;
