import type { FormConfig } from '../types'; // if needed

export const formConfig: FormConfig = {
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      placeholder: 'Enter your first name',
      required: true,
    },
    {
      name: 'bio',
      label: 'Biography',
      type: 'textarea',
      placeholder: 'Tell us about yourself',
    },
    {
      name: 'subscribe',
      label: 'Subscribe to newsletter',
      type: 'checkbox',
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
      required: true,
    },
  ],
};
