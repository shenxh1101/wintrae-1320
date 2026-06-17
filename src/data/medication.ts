import type { Medicine } from '@/types';

export const mockMedicines: Medicine[] = [
  {
    id: 'm1',
    name: '氨氯地平片',
    dosage: '5mg',
    frequency: '每日1次',
    times: ['08:00'],
    totalQuantity: 60,
    remainingQuantity: 18,
    refillThreshold: 10,
    startDate: '2026-03-01',
    endDate: '2026-12-31',
    instructions: '早餐后服用，用于控制高血压',
    takenToday: [true]
  },
  {
    id: 'm2',
    name: '二甲双胍缓释片',
    dosage: '0.5g',
    frequency: '每日2次',
    times: ['08:00', '20:00'],
    totalQuantity: 120,
    remainingQuantity: 45,
    refillThreshold: 20,
    startDate: '2026-02-15',
    endDate: '2026-08-15',
    instructions: '饭后服用，用于控制血糖',
    takenToday: [true, false]
  },
  {
    id: 'm3',
    name: '阿司匹林肠溶片',
    dosage: '100mg',
    frequency: '每日1次',
    times: ['20:00'],
    totalQuantity: 90,
    remainingQuantity: 62,
    refillThreshold: 15,
    startDate: '2026-01-10',
    instructions: '晚饭后服用，预防血栓',
    takenToday: [false]
  },
  {
    id: 'm4',
    name: '阿托伐他汀钙片',
    dosage: '20mg',
    frequency: '每日1次',
    times: ['22:00'],
    totalQuantity: 60,
    remainingQuantity: 8,
    refillThreshold: 15,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
    instructions: '睡前服用，调节血脂。存量不足请尽快复购！',
    takenToday: [false]
  },
  {
    id: 'm5',
    name: '复合维生素B族',
    dosage: '1片',
    frequency: '每日1次',
    times: ['09:00'],
    totalQuantity: 100,
    remainingQuantity: 78,
    refillThreshold: 20,
    startDate: '2026-05-01',
    instructions: '早饭后服用，补充维生素',
    takenToday: [false]
  }
];
