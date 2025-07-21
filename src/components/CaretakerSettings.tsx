import React, { useState } from 'react';
import { Bell, MailCheck } from 'lucide-react';

interface CaretakerSettingsProps {
  currentEmail: string | null;
  onSave: (email: string | null) => void;
}

const CaretakerSettings: React.FC<CaretakerSettingsProps> = ({ currentEmail, onSave }) => {
  const [email, setEmail] = useState(currentEmail || '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // allow empty (to remove caretaker)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSave = () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address or leave blank to remove');
      return;
    }

    onSave(email.trim() || null);
    setSaved(true);
    setError(null);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="w-6 h-6 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">Caretaker Notifications</h2>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        Set a caretaker's email address to receive notifications if you miss medications.
      </p>

      <label className="block text-sm font-medium text-gray-700 mb-2">Caretaker Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(null);
        }}
        placeholder="e.g., caretaker@example.com"
        className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {saved && !error && (
        <div className="flex items-center text-green-600 mt-2 text-sm">
          <MailCheck className="w-4 h-4 mr-1" />
          Email saved successfully.
        </div>
      )}

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Email
      </button>

      {currentEmail && (
        <p className="text-gray-500 text-xs mt-3">
          Current caretaker: <strong>{currentEmail}</strong>
        </p>
      )}
    </div>
  );
};

export default CaretakerSettings;
