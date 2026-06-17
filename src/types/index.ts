export type HealthType = 'bloodPressure' | 'bloodSugar' | 'temperature' | 'sleep' | 'water' | 'bowel';

export type HealthStatus = 'normal' | 'warning' | 'danger';

export interface BloodPressureRecord {
  id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  date: string;
  time: string;
  note?: string;
  status: HealthStatus;
}

export interface BloodSugarRecord {
  id: string;
  value: number;
  type: 'fasting' | 'afterMeal' | 'random';
  date: string;
  time: string;
  note?: string;
  status: HealthStatus;
}

export interface TemperatureRecord {
  id: string;
  value: number;
  date: string;
  time: string;
  note?: string;
  status: HealthStatus;
}

export interface SleepRecord {
  id: string;
  duration: number;
  quality: 'good' | 'normal' | 'poor';
  date: string;
  note?: string;
}

export interface WaterRecord {
  id: string;
  amount: number;
  date: string;
  time: string;
}

export interface BowelRecord {
  id: string;
  frequency: number;
  consistency: 'normal' | 'hard' | 'loose';
  date: string;
  note?: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  totalQuantity: number;
  remainingQuantity: number;
  refillThreshold: number;
  startDate: string;
  endDate?: string;
  instructions?: string;
  imageUrl?: string;
  takenToday: boolean[];
}

export interface MedicalAppointment {
  id: string;
  hospital: string;
  department: string;
  doctor?: string;
  date: string;
  time: string;
  type: 'outpatient' | 'followup' | 'checkup' | 'emergency';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  items?: string[];
}

export interface CheckupRecord {
  id: string;
  title: string;
  hospital: string;
  date: string;
  items: CheckupItem[];
  overallConclusion?: string;
  nextReview?: string;
  attachments?: string[];
}

export interface CheckupItem {
  name: string;
  value: string;
  referenceRange?: string;
  status: HealthStatus;
}

export interface DoctorAdvice {
  id: string;
  content: string;
  date: string;
  doctor?: string;
  hospital?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  avatar?: string;
  relationship: 'spouse' | 'child' | 'sibling' | 'other';
  isAuthorized: boolean;
}

export interface CareMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface CareTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedName: string;
  dueDate: string;
  status: 'pending' | 'completed';
  completedBy?: string;
  completedAt?: string;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  bloodPressureStats: {
    avgSystolic: number;
    avgDiastolic: number;
    abnormalCount: number;
    trend: 'improving' | 'stable' | 'worsening';
  };
  bloodSugarStats: {
    avgValue: number;
    abnormalCount: number;
    trend: 'improving' | 'stable' | 'worsening';
  };
  temperatureStats: {
    avgValue: number;
    abnormalCount: number;
  };
  sleepStats: {
    totalHours: number;
    avgHours: number;
    goodQualityCount: number;
  };
  waterStats: {
    totalMl: number;
    avgMl: number;
    targetMetDays: number;
  };
  bowelStats: {
    totalTimes: number;
    avgTimes: number;
    normalDays: number;
  };
  medicationCompliance: number;
  alerts: string[];
  recommendations: string[];
}

export interface DailyTodo {
  id: string;
  title: string;
  type: 'medicine' | 'health' | 'appointment' | 'custom';
  time: string;
  isCompleted: boolean;
  relatedId?: string;
}
