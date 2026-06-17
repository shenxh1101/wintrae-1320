import type {
  BloodPressureRecord,
  BloodSugarRecord,
  TemperatureRecord,
  SleepRecord,
  WaterRecord,
  BowelRecord
} from '@/types';

export const mockBloodPressureRecords: BloodPressureRecord[] = [
  { id: 'bp1', systolic: 138, diastolic: 88, pulse: 78, date: '2026-06-18', time: '08:00', status: 'warning', note: '晨起测量' },
  { id: 'bp2', systolic: 125, diastolic: 82, pulse: 72, date: '2026-06-17', time: '20:00', status: 'normal' },
  { id: 'bp3', systolic: 145, diastolic: 92, pulse: 80, date: '2026-06-17', time: '08:30', status: 'warning' },
  { id: 'bp4', systolic: 120, diastolic: 78, pulse: 70, date: '2026-06-16', time: '19:30', status: 'normal' },
  { id: 'bp5', systolic: 130, diastolic: 85, pulse: 75, date: '2026-06-16', time: '08:00', status: 'normal' },
  { id: 'bp6', systolic: 168, diastolic: 102, pulse: 88, date: '2026-06-15', time: '10:00', status: 'danger', note: '活动后测量，建议休息后复测' },
  { id: 'bp7', systolic: 142, diastolic: 90, pulse: 76, date: '2026-06-15', time: '08:15', status: 'warning' },
  { id: 'bp8', systolic: 128, diastolic: 84, pulse: 72, date: '2026-06-14', time: '19:00', status: 'normal' },
  { id: 'bp9', systolic: 135, diastolic: 88, pulse: 74, date: '2026-06-14', time: '08:30', status: 'warning' },
  { id: 'bp10', systolic: 122, diastolic: 80, pulse: 68, date: '2026-06-13', time: '20:00', status: 'normal' }
];

export const mockBloodSugarRecords: BloodSugarRecord[] = [
  { id: 'bs1', value: 6.2, type: 'fasting', date: '2026-06-18', time: '07:30', status: 'warning', note: '空腹' },
  { id: 'bs2', value: 8.5, type: 'afterMeal', date: '2026-06-17', time: '13:00', status: 'warning', note: '午餐后2小时' },
  { id: 'bs3', value: 5.8, type: 'fasting', date: '2026-06-17', time: '07:00', status: 'normal' },
  { id: 'bs4', value: 7.2, type: 'afterMeal', date: '2026-06-16', time: '19:30', status: 'normal' },
  { id: 'bs5', value: 5.5, type: 'fasting', date: '2026-06-16', time: '07:15', status: 'normal' },
  { id: 'bs6', value: 11.8, type: 'afterMeal', date: '2026-06-15', time: '12:30', status: 'danger', note: '建议咨询医生调整饮食' },
  { id: 'bs7', value: 6.0, type: 'fasting', date: '2026-06-15', time: '07:00', status: 'normal' },
  { id: 'bs8', value: 7.8, type: 'afterMeal', date: '2026-06-14', time: '19:00', status: 'warning' },
  { id: 'bs9', value: 5.6, type: 'fasting', date: '2026-06-14', time: '07:30', status: 'normal' },
  { id: 'bs10', value: 6.8, type: 'random', date: '2026-06-13', time: '15:00', status: 'normal' }
];

export const mockTemperatureRecords: TemperatureRecord[] = [
  { id: 't1', value: 36.5, date: '2026-06-18', time: '08:00', status: 'normal' },
  { id: 't2', value: 36.6, date: '2026-06-17', time: '20:00', status: 'normal' },
  { id: 't3', value: 36.3, date: '2026-06-17', time: '08:00', status: 'normal' },
  { id: 't4', value: 37.5, date: '2026-06-16', time: '22:00', status: 'warning', note: '有些畏寒，多喝水' },
  { id: 't5', value: 36.8, date: '2026-06-16', time: '08:00', status: 'normal' },
  { id: 't6', value: 36.4, date: '2026-06-15', time: '20:00', status: 'normal' },
  { id: 't7', value: 36.5, date: '2026-06-15', time: '08:00', status: 'normal' }
];

export const mockSleepRecords: SleepRecord[] = [
  { id: 's1', duration: 7.5, quality: 'good', date: '2026-06-17', note: '睡得不错' },
  { id: 's2', duration: 6.0, quality: 'normal', date: '2026-06-16' },
  { id: 's3', duration: 5.0, quality: 'poor', date: '2026-06-15', note: '夜醒3次' },
  { id: 's4', duration: 8.0, quality: 'good', date: '2026-06-14' },
  { id: 's5', duration: 6.5, quality: 'normal', date: '2026-06-13' },
  { id: 's6', duration: 7.0, quality: 'good', date: '2026-06-12' },
  { id: 's7', duration: 5.5, quality: 'poor', date: '2026-06-11', note: '起夜多次' }
];

export const mockWaterRecords: WaterRecord[] = [
  { id: 'w1', amount: 250, date: '2026-06-18', time: '08:00' },
  { id: 'w2', amount: 200, date: '2026-06-18', time: '10:00' },
  { id: 'w3', amount: 250, date: '2026-06-18', time: '12:30' },
  { id: 'w4', amount: 200, date: '2026-06-18', time: '15:00' },
  { id: 'w5', amount: 250, date: '2026-06-17', time: '08:30' },
  { id: 'w6', amount: 300, date: '2026-06-17', time: '11:00' },
  { id: 'w7', amount: 200, date: '2026-06-17', time: '14:00' },
  { id: 'w8', amount: 250, date: '2026-06-17', time: '17:00' },
  { id: 'w9', amount: 200, date: '2026-06-17', time: '20:00' }
];

export const mockBowelRecords: BowelRecord[] = [
  { id: 'b1', frequency: 1, consistency: 'normal', date: '2026-06-18' },
  { id: 'b2', frequency: 1, consistency: 'normal', date: '2026-06-17' },
  { id: 'b3', frequency: 0, consistency: 'normal', date: '2026-06-16', note: '未排便' },
  { id: 'b4', frequency: 2, consistency: 'loose', date: '2026-06-15', note: '略稀，注意饮食' },
  { id: 'b5', frequency: 1, consistency: 'normal', date: '2026-06-14' },
  { id: 'b6', frequency: 1, consistency: 'hard', date: '2026-06-13', note: '略干，多吃蔬果' },
  { id: 'b7', frequency: 1, consistency: 'normal', date: '2026-06-12' }
];
