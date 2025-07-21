// src/utils/medicationUtils.ts

// src/utils/medicationUtils.ts
import type { Medication, MedicationLog, UserAccount } from '../types';

export const mockDatabase = {
  users: [] as UserAccount[],

  createUser: (email: string, ): UserAccount => {// password removed
    const user: UserAccount = {
      id: Date.now().toString(),
      email,
      medications: [],
      logs: [],
    };
    mockDatabase.users.push(user);
    return user;
  },

  authenticateUser: (email: string): UserAccount | null => {
    return mockDatabase.users.find((u) => u.email === email) || null;
  },

  updateUser: (userId: string, updates: Partial<UserAccount>): void => {
    const userIndex = mockDatabase.users.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      mockDatabase.users[userIndex] = {
        ...mockDatabase.users[userIndex],
        ...updates,
      };
    }
  },
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};

export const isOverdue = (medication: Medication, logs: MedicationLog[]): boolean => {
  const today = getTodayString();
  const todayLog = logs.find(
    (log) => log.medicationId === medication.id && log.date === today
  );

  if (todayLog?.taken) return false;

  const [hours, minutes] = medication.time.split(':').map(Number);
  const medicationTime = new Date();
  medicationTime.setHours(hours, minutes, 0, 0);

  const now = new Date();
  const overdueTime = new Date(medicationTime.getTime() + 30 * 60 * 1000); // 30 minutes

  return now > overdueTime;
};
