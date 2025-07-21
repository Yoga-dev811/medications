// src/types.ts

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  createdAt: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  date: string;
  taken: boolean;
  timestamp: string;
}

export interface UserAccount {
  id: string;
  email: string;
  caretakerEmail?: string;
  medications: Medication[];
  logs: MedicationLog[];
}
