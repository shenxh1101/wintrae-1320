import { create } from 'zustand';
import type {
  BloodPressureRecord,
  BloodSugarRecord,
  TemperatureRecord,
  SleepRecord,
  WaterRecord,
  BowelRecord,
  Medicine,
  MedicalAppointment,
  CheckupRecord,
  DoctorAdvice,
  FamilyMember,
  CareMessage,
  CareTask,
  DailyTodo,
  HealthStatus
} from '@/types';

interface AppState {
  elderName: string;
  elderAge: number;
  isElderMode: boolean;

  bloodPressureRecords: BloodPressureRecord[];
  bloodSugarRecords: BloodSugarRecord[];
  temperatureRecords: TemperatureRecord[];
  sleepRecords: SleepRecord[];
  waterRecords: WaterRecord[];
  bowelRecords: BowelRecord[];

  medicines: Medicine[];
  appointments: MedicalAppointment[];
  checkupRecords: CheckupRecord[];
  doctorAdvices: DoctorAdvice[];

  familyMembers: FamilyMember[];
  careMessages: CareMessage[];
  careTasks: CareTask[];

  dailyTodos: DailyTodo[];

  setElderMode: (mode: boolean) => void;
  addBloodPressure: (record: Omit<BloodPressureRecord, 'id' | 'status'>) => void;
  addBloodSugar: (record: Omit<BloodSugarRecord, 'id' | 'status'>) => void;
  addTemperature: (record: Omit<TemperatureRecord, 'id' | 'status'>) => void;
  addSleep: (record: Omit<SleepRecord, 'id'>) => void;
  addWater: (record: Omit<WaterRecord, 'id'>) => void;
  addBowel: (record: Omit<BowelRecord, 'id'>) => void;
  addMedicine: (medicine: Omit<Medicine, 'id' | 'takenToday'>) => void;
  toggleMedicineTaken: (medicineId: string, timeIndex: number) => void;
  toggleTodo: (todoId: string) => void;
  sendCareMessage: (content: string, senderName: string, senderRole: string) => void;
  completeTask: (taskId: string, memberName: string) => void;
}

const getBloodPressureStatus = (systolic: number, diastolic: number): HealthStatus => {
  if (systolic >= 160 || diastolic >= 100) return 'danger';
  if (systolic >= 140 || diastolic >= 90) return 'warning';
  if (systolic < 90 || diastolic < 60) return 'warning';
  return 'normal';
};

const getBloodSugarStatus = (value: number, type: string): HealthStatus => {
  if (type === 'fasting') {
    if (value >= 7.0) return 'danger';
    if (value >= 6.1) return 'warning';
    if (value < 3.9) return 'danger';
    return 'normal';
  }
  if (value >= 11.1) return 'danger';
  if (value >= 7.8) return 'warning';
  return 'normal';
};

const getTemperatureStatus = (value: number): HealthStatus => {
  if (value >= 38.5) return 'danger';
  if (value >= 37.3) return 'warning';
  if (value < 36.0) return 'warning';
  return 'normal';
};

export const useAppStore = create<AppState>((set) => ({
  elderName: '王奶奶',
  elderAge: 78,
  isElderMode: false,

  bloodPressureRecords: [],
  bloodSugarRecords: [],
  temperatureRecords: [],
  sleepRecords: [],
  waterRecords: [],
  bowelRecords: [],

  medicines: [],
  appointments: [],
  checkupRecords: [],
  doctorAdvices: [],

  familyMembers: [],
  careMessages: [],
  careTasks: [],

  dailyTodos: [],

  setElderMode: (mode) => set({ isElderMode: mode }),

  addBloodPressure: (record) =>
    set((state) => ({
      bloodPressureRecords: [
        ...state.bloodPressureRecords,
        {
          ...record,
          id: Date.now().toString(),
          status: getBloodPressureStatus(record.systolic, record.diastolic)
        }
      ]
    })),

  addBloodSugar: (record) =>
    set((state) => ({
      bloodSugarRecords: [
        ...state.bloodSugarRecords,
        {
          ...record,
          id: Date.now().toString(),
          status: getBloodSugarStatus(record.value, record.type)
        }
      ]
    })),

  addTemperature: (record) =>
    set((state) => ({
      temperatureRecords: [
        ...state.temperatureRecords,
        {
          ...record,
          id: Date.now().toString(),
          status: getTemperatureStatus(record.value)
        }
      ]
    })),

  addSleep: (record) =>
    set((state) => ({
      sleepRecords: [...state.sleepRecords, { ...record, id: Date.now().toString() }]
    })),

  addWater: (record) =>
    set((state) => ({
      waterRecords: [...state.waterRecords, { ...record, id: Date.now().toString() }]
    })),

  addBowel: (record) =>
    set((state) => ({
      bowelRecords: [...state.bowelRecords, { ...record, id: Date.now().toString() }]
    })),

  addMedicine: (medicine) =>
    set((state) => ({
      medicines: [
        ...state.medicines,
        {
          ...medicine,
          id: Date.now().toString(),
          takenToday: new Array(medicine.times.length).fill(false)
        }
      ]
    })),

  toggleMedicineTaken: (medicineId, timeIndex) =>
    set((state) => ({
      medicines: state.medicines.map((m) =>
        m.id === medicineId
          ? {
              ...m,
              takenToday: m.takenToday.map((t, i) => (i === timeIndex ? !t : t)),
              remainingQuantity: !m.takenToday[timeIndex] ? m.remainingQuantity - 1 : m.remainingQuantity + 1
            }
          : m
      )
    })),

  toggleTodo: (todoId) =>
    set((state) => ({
      dailyTodos: state.dailyTodos.map((t) =>
        t.id === todoId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    })),

  sendCareMessage: (content, senderName, senderRole) =>
    set((state) => ({
      careMessages: [
        ...state.careMessages,
        {
          id: Date.now().toString(),
          senderId: 'user',
          senderName,
          senderRole,
          content,
          timestamp: new Date().toISOString(),
          isRead: false
        }
      ]
    })),

  completeTask: (taskId, memberName) =>
    set((state) => ({
      careTasks: state.careTasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              completedBy: memberName,
              completedAt: new Date().toISOString()
            }
          : t
      )
    }))
}));
