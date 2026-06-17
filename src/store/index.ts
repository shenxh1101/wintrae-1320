import { create } from 'zustand';
import Taro from '@tarojs/taro';
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
  DailyTodo
} from '@/types';
import {
  mockBloodPressureRecords,
  mockBloodSugarRecords,
  mockTemperatureRecords,
  mockSleepRecords,
  mockWaterRecords,
  mockBowelRecords
} from '@/data/health';
import { mockMedicines } from '@/data/medication';
import {
  mockAppointments,
  mockCheckupRecords,
  mockDoctorAdvices
} from '@/data/medical';
import {
  mockFamilyMembers,
  mockCareMessages,
  mockCareTasks
} from '@/data/family';
import { generateId, getTodayDate } from '@/utils';

const STORAGE_KEY = 'kanghu-jiayuan-store-v2';

type AppState = {
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
  todos: DailyTodo[];
  elderMode: boolean;

  addBloodPressure: (record: Omit<BloodPressureRecord, 'id' | 'date' | 'time' | 'status'>) => void;
  addBloodSugar: (record: Omit<BloodSugarRecord, 'id' | 'date' | 'time' | 'status'>) => void;
  addTemperature: (record: Omit<TemperatureRecord, 'id' | 'date' | 'time' | 'status'>) => void;
  addSleep: (record: Omit<SleepRecord, 'id' | 'date'>) => void;
  addWater: (record: Omit<WaterRecord, 'id' | 'date' | 'time'>) => void;
  addBowel: (record: Omit<BowelRecord, 'id' | 'date' | 'time'>) => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  toggleMedicineTaken: (medicineId: string, timeIndex: number) => void;
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  toggleFamilyAuth: (memberId: string) => void;
  addAppointment: (appointment: Omit<MedicalAppointment, 'id'>) => void;
  sendCareMessage: (content: string, senderName: string, senderRole: string) => void;
  completeTask: (taskId: string, memberName: string) => void;
  toggleTodo: (todoId: string) => void;
  setElderMode: (mode: boolean) => void;
  resetToDefaults: () => void;
};

const getDefaultTodos = (): DailyTodo[] => {
  const today = getTodayDate();
  return [
    { id: 't1', title: '市一院心内科复诊', type: 'appointment', time: '09:30', isCompleted: false, relatedId: 'a1' },
    { id: 't2', title: '服用氨氯地平片 5mg', type: 'medicine', time: '08:00', isCompleted: true, relatedId: 'm1' },
    { id: 't3', title: '服用二甲双胍缓释片 0.5g', type: 'medicine', time: '08:00', isCompleted: true, relatedId: 'm2' },
    { id: 't4', title: '测量血压血糖', type: 'health', time: '08:00', isCompleted: true },
    { id: 't5', title: '服用阿托伐他汀钙片 20mg', type: 'medicine', time: '22:00', isCompleted: false, relatedId: 'm4' },
    { id: 't6', title: '睡前温水泡脚', type: 'health', time: '21:00', isCompleted: false },
    { id: 't7', title: '记录今日排便情况', type: 'health', time: '22:00', isCompleted: false }
  ];
};

const getInitialState = () => {
  try {
    const stored = Taro.getStorageSync(STORAGE_KEY);
    if (stored && typeof stored === 'object' && stored.bloodPressureRecords) {
      return stored;
    }
  } catch (e) {
    console.warn('读取本地存储失败，使用默认数据');
  }

  return {
    bloodPressureRecords: mockBloodPressureRecords,
    bloodSugarRecords: mockBloodSugarRecords,
    temperatureRecords: mockTemperatureRecords,
    sleepRecords: mockSleepRecords,
    waterRecords: mockWaterRecords,
    bowelRecords: mockBowelRecords,
    medicines: mockMedicines,
    appointments: mockAppointments,
    checkupRecords: mockCheckupRecords,
    doctorAdvices: mockDoctorAdvices,
    familyMembers: mockFamilyMembers,
    careMessages: mockCareMessages,
    careTasks: mockCareTasks,
    todos: getDefaultTodos(),
    elderMode: false
  };
};

const persist = (state: any) => {
  try {
    Taro.setStorageSync(STORAGE_KEY, state);
  } catch (e) {
    console.warn('保存本地存储失败');
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  ...getInitialState(),

  addBloodPressure: (record) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    let status: 'normal' | 'warning' | 'danger' = 'normal';
    if (record.systolic >= 160 || record.diastolic >= 100) status = 'danger';
    else if (record.systolic >= 140 || record.diastolic >= 90) status = 'warning';
    const newRecord: BloodPressureRecord = {
      id: generateId(),
      date,
      time,
      status,
      ...record
    };
    set((state) => {
      const newState = {
        ...state,
        bloodPressureRecords: [newRecord, ...state.bloodPressureRecords]
      };
      persist(newState);
      return newState;
    });
  },

  addBloodSugar: (record) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    let status: 'normal' | 'warning' | 'danger' = 'normal';
    if (record.type === 'fasting' && record.value >= 7.0) status = 'danger';
    else if (record.type === 'fasting' && record.value >= 6.1) status = 'warning';
    else if (record.type === 'afterMeal' && record.value >= 11.1) status = 'danger';
    else if (record.type === 'afterMeal' && record.value >= 7.8) status = 'warning';
    else if (record.type === 'random' && record.value >= 11.1) status = 'danger';
    const newRecord: BloodSugarRecord = {
      id: generateId(),
      date,
      time,
      status,
      ...record
    };
    set((state) => {
      const newState = {
        ...state,
        bloodSugarRecords: [newRecord, ...state.bloodSugarRecords]
      };
      persist(newState);
      return newState;
    });
  },

  addTemperature: (record) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    let status: 'normal' | 'warning' | 'danger' = 'normal';
    if (record.value >= 38.5) status = 'danger';
    else if (record.value >= 37.3) status = 'warning';
    const newRecord: TemperatureRecord = {
      id: generateId(),
      date,
      time,
      status,
      ...record
    };
    set((state) => {
      const newState = {
        ...state,
        temperatureRecords: [newRecord, ...state.temperatureRecords]
      };
      persist(newState);
      return newState;
    });
  },

  addSleep: (record) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const newRecord: SleepRecord = {
      id: generateId(),
      date,
      ...record
    };
    set((state) => {
      const newState = {
        ...state,
        sleepRecords: [newRecord, ...state.sleepRecords]
      };
      persist(newState);
      return newState;
    });
  },

  addWater: (record) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    const newRecord: WaterRecord = {
      id: generateId(),
      date,
      time,
      ...record
    };
    set((state) => {
      const newState = {
        ...state,
        waterRecords: [newRecord, ...state.waterRecords]
      };
      persist(newState);
      return newState;
    });
  },

  addBowel: (record) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    const newRecord: BowelRecord = {
      id: generateId(),
      date,
      time,
      ...record
    };
    set((state) => {
      const newState = {
        ...state,
        bowelRecords: [newRecord, ...state.bowelRecords]
      };
      persist(newState);
      return newState;
    });
  },

  addMedicine: (medicine) => {
    const newMedicine: Medicine = {
      id: generateId(),
      ...medicine
    };
    set((state) => {
      const newState = {
        ...state,
        medicines: [newMedicine, ...state.medicines]
      };
      persist(newState);
      return newState;
    });
  },

  toggleMedicineTaken: (medicineId, timeIndex) => {
    set((state) => {
      const updatedMedicines = state.medicines.map(med => {
        if (med.id !== medicineId) return med;
        const takenToday = [...med.takenToday];
        const wasTaken = takenToday[timeIndex];
        takenToday[timeIndex] = !wasTaken;

        const remainingQuantity = wasTaken
          ? med.remainingQuantity + 1
          : Math.max(0, med.remainingQuantity - 1);

        return { ...med, takenToday, remainingQuantity };
      });
      const newState = { ...state, medicines: updatedMedicines };
      persist(newState);
      return newState;
    });
  },

  addFamilyMember: (member) => {
    const newMember: FamilyMember = {
      id: generateId(),
      ...member
    };
    set((state) => {
      const newState = {
        ...state,
        familyMembers: [...state.familyMembers, newMember]
      };
      persist(newState);
      return newState;
    });
  },

  toggleFamilyAuth: (memberId) => {
    set((state) => {
      const updatedMembers = state.familyMembers.map(m =>
        m.id === memberId ? { ...m, isAuthorized: !m.isAuthorized } : m
      );
      const newState = { ...state, familyMembers: updatedMembers };
      persist(newState);
      return newState;
    });
  },

  addAppointment: (appointment) => {
    const newAppointment: MedicalAppointment = {
      id: generateId(),
      ...appointment
    };
    set((state) => {
      const sorted = [...state.appointments, newAppointment].sort((a, b) => {
        const dateA = `${a.date} ${a.time}`;
        const dateB = `${b.date} ${b.time}`;
        return dateA.localeCompare(dateB);
      });
      const newState = { ...state, appointments: sorted };
      persist(newState);
      return newState;
    });
  },

  sendCareMessage: (content, senderName, senderRole) => {
    const now = new Date();
    const newMessage: CareMessage = {
      id: generateId(),
      senderId: 'self',
      senderName,
      senderRole,
      content,
      timestamp: now.toISOString(),
      isRead: false
    };
    set((state) => {
      const newState = {
        ...state,
        careMessages: [newMessage, ...state.careMessages]
      };
      persist(newState);
      return newState;
    });
  },

  completeTask: (taskId, memberName) => {
    const now = new Date();
    set((state) => {
      const updatedTasks = state.careTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: 'completed' as const,
              completedBy: memberName,
              completedAt: now.toISOString()
            }
          : task
      );
      const newState = { ...state, careTasks: updatedTasks };
      persist(newState);
      return newState;
    });
  },

  toggleTodo: (todoId) => {
    set((state) => {
      const updatedTodos = state.todos.map(todo =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
      );
      const newState = { ...state, todos: updatedTodos };
      persist(newState);
      return newState;
    });
  },

  setElderMode: (mode) => {
    set((state) => {
      const newState = { ...state, elderMode: mode };
      persist(newState);
      return newState;
    });
  },

  resetToDefaults: () => {
    try {
      Taro.removeStorageSync(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    set(getInitialState());
  }
}));
