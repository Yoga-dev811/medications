import React, { useState } from 'react';
import type { Medication } from '../types';

interface AddMedicationFormProps {
  onAdd: (medication: Omit<Medication, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once daily');
  const [time, setTime] = useState('08:00');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Medication name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Medication name must be at least 2 characters';
    }

    if (!dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }

    if (!time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onAdd({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency,
      time
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Medication</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medication Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Aspirin"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dosage *
          </label>
          <input
            type="text"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.dosage ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., 100mg"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {errors.dosage && <p className="text-red-600 text-sm mt-1">{errors.dosage}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Once daily">Once daily</option>
            <option value="Twice daily">Twice daily</option>
            <option value="Three times daily">Three times daily</option>
            <option value="As needed">As needed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time *
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.time ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.time && <p className="text-red-600 text-sm mt-1">{errors.time}</p>}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Medication
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMedicationForm;