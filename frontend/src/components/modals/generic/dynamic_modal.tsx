import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';

export interface FieldMetadata {
  name: string;
  type: 'string' | 'text' | 'number' | 'boolean' | 'array';
}

interface DynamicModalProps {
  metadata: FieldMetadata[];
  onStateChange?: (formData: FormData) => void;
}

type FormDataValue = string | number | boolean | any[] | null;

interface FormData {
  [key: string]: FormDataValue;
}

// Render appropriate input based on field type
const renderInput = (field: FieldMetadata, value: FormDataValue, onChange: (fieldName: string, value: FormDataValue) => void): ReactElement => {
  switch (field.type) {
    case 'string':
    case 'text':
      return (
        <input
          key={field.name}
          type="text"
          value={String(value || '')}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
    
    case 'number':
      return (
        <input
          key={field.name}
          type="number"
          value={Number(value || 0)}
          onChange={(e) => onChange(field.name, Number(e.target.value))}
        />
      );
    
    case 'boolean':
      return (
        <input
          key={field.name}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
        />
      );
    
    case 'array':
      return (
        <textarea
          key={field.name}
          placeholder="Enter comma-separated values"
          value={Array.isArray(value) ? value.join(', ') : ''}
          onChange={(e) => onChange(field.name, e.target.value.split(',').map(item => item.trim()).filter(item => item))}
        />
      );
    
    default:
      return (
        <input
          key={field.name}
          type="text"
          value={String(value || '')}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      );
  }
};

const DynamicModal = ({ metadata, onStateChange }: DynamicModalProps) => {
  // Create a single state object with all dynamic fields
  const [formData, setFormData] = useState<FormData>({});

  // Initialize state when metadata changes
  useEffect(() => {
    if (metadata) {
      const initialState: FormData = {};
      metadata.forEach(field => {
        // Set default values based on type
        switch (field.type) {
          case 'string':
          case 'text':
            initialState[field.name] = '';
            break;
          case 'number':
            initialState[field.name] = 0;
            break;
          case 'boolean':
            initialState[field.name] = false;
            break;
          case 'array':
            initialState[field.name] = [];
            break;
          default:
            initialState[field.name] = null;
        }
      });
      setFormData(initialState);
    }
  }, [metadata]);

  // Notify parent component when form data changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(formData);
    }
  }, [formData, onStateChange]);

  // Generic handler for updating any field
  const handleFieldChange = (fieldName: string, value: FormDataValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div>
      {metadata?.map(field => (
        <div key={field.name}>
          <label>{field.name}</label>
          {renderInput(field, formData[field.name], handleFieldChange)}
        </div>
      ))}
    </div>
  );
};

export default DynamicModal;