import React from 'react';
import type { Medication, MedicationLog } from '../types';
import { Calendar, Clock } from 'lucide-react';
import { getTodayString, isOverdue } from '../utils/medicationUtils';

interface MedicationCardProps {
  medication: Medication;
  logs: MedicationLog[];
  onMarkTaken: (medicationId: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication, logs, onMarkTaken }) => {
  const today = getTodayString();
  const todayLog = logs.find(
    log => log.medicationId === medication.id && log.date === today
  );

  const isTaken = todayLog?.taken || false;
  const overdue = isOverdue(medication, logs);

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
      isTaken ? 'border-green-500' : overdue ? 'border-red-500' : 'border-blue-500'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
          <p className="text-gray-600">{medication.dosage}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isTaken 
            ? 'bg-green-100 text-green-700' 
            : overdue 
            ? 'bg-red-100 text-red-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {isTaken ? 'Taken' : overdue ? 'Overdue' : 'Pending'}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{medication.frequency}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{medication.time}</span>
        </div>
      </div>

      {!isTaken && (
        <button
          onClick={() => onMarkTaken(medication.id)}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            overdue 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Mark as Taken
        </button>
      )}

      {isTaken && todayLog && (
        <div className="text-sm text-gray-500 text-center">
          Taken at {new Date(todayLog.timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default MedicationCard;
