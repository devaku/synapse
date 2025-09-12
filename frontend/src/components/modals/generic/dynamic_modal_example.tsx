import { useState } from 'react';
import DynamicModal from './dynamic_modal';
import schema from '../../assets/schemas/schema.json';
import type { FieldMetadata } from './dynamic_modal';

const DynamicModalExample = () => {
  const [selectedForm, setSelectedForm] = useState<string>('userProfile');
  const [formState, setFormState] = useState<Record<string, any>>({});

  // Get the metadata for the selected form
  const getMetadata = (): FieldMetadata[] => {
    return (schema[selectedForm as keyof typeof schema] || []) as FieldMetadata[];
  };

  // Handle form state updates from the dynamic modal
  const handleFormStateChange = (newState: Record<string, any>) => {
    setFormState(newState);
  };

  // Reset form state when changing form types
  const handleFormTypeChange = (newFormType: string) => {
    setSelectedForm(newFormType);
    setFormState({}); // Clear the state display
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Dynamic Modal Testing</h2>
      
      {/* Form selector */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="formSelect">Select Form Type: </label>
        <select 
          id="formSelect"
          value={selectedForm} 
          onChange={(e) => handleFormTypeChange(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="userProfile">User Profile</option>
          <option value="taskForm">Task Form</option>
          <option value="teamSettings">Team Settings</option>
        </select>
      </div>

      {/* Dynamic Modal */}
      <div style={{ 
        border: '1px solid #ccc', 
        padding: '20px', 
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h3>Dynamic Form: {selectedForm}</h3>
        <DynamicModal 
          metadata={getMetadata()} 
          onStateChange={handleFormStateChange}
        />
      </div>

      {/* Real-time State Display */}
      <div style={{ 
        marginTop: '20px',
        border: '2px solid #4CAF50',
        padding: '15px',
        borderRadius: '8px',
        backgroundColor: '#f0f8f0'
      }}>
        <h4>📊 Current Form State (Updates in Real-time)</h4>
        <div style={{ 
          backgroundColor: '#ffffff', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'monospace',
          border: '1px solid #ddd'
        }}>
          {Object.keys(formState).length > 0 ? (
            <pre>{JSON.stringify(formState, null, 2)}</pre>
          ) : (
            <em style={{ color: '#666' }}>Start typing in the form above to see state changes...</em>
          )}
        </div>
        
        {/* Individual field display */}
        {Object.keys(formState).length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h5>Field Values:</h5>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              {Object.entries(formState).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {
                    typeof value === 'boolean' 
                      ? (value ? '✅ true' : '❌ false')
                      : Array.isArray(value)
                        ? `[${value.length} items: ${value.join(', ')}]`
                        : `"${value}"`
                  }
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Schema Preview */}
      <div style={{ marginTop: '20px' }}>
        <h4>Current Schema:</h4>
        <pre style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          fontSize: '12px',
          overflow: 'auto'
        }}>
          {JSON.stringify(getMetadata(), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default DynamicModalExample;
