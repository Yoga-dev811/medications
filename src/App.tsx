

import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient'
import type { Session } from '@supabase/supabase-js';
import LoginForm from './components/ LoginForm';
import AddMedicationForm from './components/AddMedicationForm';
import MedicationCard from './components/MedicationCard';
import CaretakerSettings from './components/CaretakerSettings';
import type { Medication, MedicationLog } from './types';
import { getTodayString } from './utils/medicationUtils';

type View = 'medications' | 'add' | 'settings';

      
const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>('medications');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [caretakerEmail, setCaretakerEmail] = useState<string | null>(null);

  useEffect(() => {
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user.id) {
      fetchMedications();
      fetchLogs();
      fetchCaretakerEmail();
    }
  }, [session]);

  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('userId', session?.user.id)
      .order('createdAt', { ascending: false });

    if (data) setMedications(data as Medication[]);
  };

  const fetchLogs = async () => {
    const today = getTodayString();
    const { data, error } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('userId', session?.user.id)
      .eq('date', today);

    if (data) setLogs(data as MedicationLog[]);
  };

  const fetchCaretakerEmail = async () => {
    const { data, error } = await supabase
      .from('caretakers')
      .select('email')
      .eq('userId', session?.user.id)
      .single();

    if (data) setCaretakerEmail(data.email);
  };

  const handleAddMedication = async (med: Omit<Medication, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('medications')
      .insert([{ ...med, userId: session?.user.id }])
      .select();

    if (data && data.length > 0) {
      setMedications([data[0] as Medication, ...medications]);
      setView('medications');
    }
  };

  const handleMarkTaken = async (medicationId: string) => {
    const newLog = {
      medicationId,
      userId: session?.user.id,
      date: getTodayString(),
      taken: true,
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('medication_logs')
      .insert([newLog]);

    if (data) fetchLogs();
  };

  const handleCaretakerSave = async (email: string | null) => {
    if (!session?.user.id) return;

    const { data: existing } = await supabase
      .from('caretakers')
      .select('*')
      .eq('userId', session.user.id)
      .single();

    if (existing) {
      await supabase
        .from('caretakers')
        .update({ email })
        .eq('userId', session.user.id);
    } else {
      await supabase
        .from('caretakers')
        .insert([{ email, userId: session.user.id }]);
    }

    setCaretakerEmail(email);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };
// adding code yoga
  const handleLogin = (session: Session) => {
  setSession(session);
};

 if (!session) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MedsBuddy</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setView('medications')}
          className={`px-3 py-1 rounded-lg text-sm ${
            view === 'medications' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border'
          }`}
        >
          Medications
        </button>
        <button
          onClick={() => setView('add')}
          className={`px-3 py-1 rounded-lg text-sm ${
            view === 'add' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border'
          }`}
        >
          Add
        </button>
        <button
          onClick={() => setView('settings')}
          className={`px-3 py-1 rounded-lg text-sm ${
            view === 'settings' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 border'
          }`}
        >
          Settings
        </button>
      </div>

      {view === 'medications' && (
        <div className="space-y-4">
          {medications.map((med) => (
            <MedicationCard
              key={med.id}
              medication={med}
              logs={logs}
              onMarkTaken={handleMarkTaken}
            />
          ))}
          {medications.length === 0 && (
            <p className="text-center text-gray-500">No medications added yet.</p>
          )}
        </div>
      )}

      {view === 'add' && (
        <AddMedicationForm
          onAdd={handleAddMedication}
          onCancel={() => setView('medications')}
        />
      )}

      {view === 'settings' && (
        <CaretakerSettings
          currentEmail={caretakerEmail}
          onSave={handleCaretakerSave}
        />
      )}
    </div>
  );
};

export default App;

