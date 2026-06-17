import type { MedicalAppointment, CheckupRecord, DoctorAdvice } from '@/types';

export const mockAppointments: MedicalAppointment[] = [
  {
    id: 'a1',
    hospital: '市第一人民医院',
    department: '心血管内科',
    doctor: '李主任',
    date: '2026-06-22',
    time: '09:30',
    type: 'followup',
    status: 'upcoming',
    notes: '定期复查血压，携带近一周血压记录',
    items: ['血压测量', '心电图检查', '血脂化验']
  },
  {
    id: 'a2',
    hospital: '市第一人民医院',
    department: '内分泌科',
    doctor: '张医生',
    date: '2026-06-28',
    time: '14:00',
    type: 'followup',
    status: 'upcoming',
    notes: '复查血糖糖化血红蛋白',
    items: ['空腹血糖', '糖化血红蛋白', '肝肾功能']
  },
  {
    id: 'a3',
    hospital: '市中心医院',
    department: '老年科',
    doctor: '王医生',
    date: '2026-06-10',
    time: '10:00',
    type: 'outpatient',
    status: 'completed',
    notes: '近期睡眠不好就诊'
  },
  {
    id: 'a4',
    hospital: '市第一人民医院',
    department: '体检中心',
    date: '2026-07-15',
    time: '08:00',
    type: 'checkup',
    status: 'upcoming',
    notes: '年度全面体检，需空腹',
    items: ['全面血常规', '腹部B超', '胸部CT', '骨密度检测', '眼底检查']
  }
];

export const mockCheckupRecords: CheckupRecord[] = [
  {
    id: 'c1',
    title: '2026年第一季度体检报告',
    hospital: '市第一人民医院',
    date: '2026-03-20',
    items: [
      { name: '收缩压', value: '135 mmHg', referenceRange: '90-140', status: 'warning' },
      { name: '舒张压', value: '85 mmHg', referenceRange: '60-90', status: 'normal' },
      { name: '空腹血糖', value: '6.5 mmol/L', referenceRange: '3.9-6.1', status: 'warning' },
      { name: '总胆固醇', value: '5.8 mmol/L', referenceRange: '<5.2', status: 'warning' },
      { name: '甘油三酯', value: '1.8 mmol/L', referenceRange: '<1.7', status: 'warning' },
      { name: '高密度脂蛋白', value: '1.2 mmol/L', referenceRange: '>1.0', status: 'normal' },
      { name: '低密度脂蛋白', value: '3.6 mmol/L', referenceRange: '<3.4', status: 'warning' },
      { name: '肝功能(ALT)', value: '32 U/L', referenceRange: '0-40', status: 'normal' },
      { name: '肾功能(Cr)', value: '78 μmol/L', referenceRange: '44-133', status: 'normal' },
      { name: '心电图', value: '窦性心律', status: 'normal' }
    ],
    overallConclusion: '血压、血糖及血脂偏高，建议定期监测，遵医嘱服药，注意饮食控制和适度运动。',
    nextReview: '3个月后复查'
  },
  {
    id: 'c2',
    title: '2026年5月血脂复查',
    hospital: '市第一人民医院',
    date: '2026-05-18',
    items: [
      { name: '总胆固醇', value: '5.2 mmol/L', referenceRange: '<5.2', status: 'normal' },
      { name: '甘油三酯', value: '1.5 mmol/L', referenceRange: '<1.7', status: 'normal' },
      { name: '低密度脂蛋白', value: '3.1 mmol/L', referenceRange: '<3.4', status: 'normal' },
      { name: '高密度脂蛋白', value: '1.3 mmol/L', referenceRange: '>1.0', status: 'normal' }
    ],
    overallConclusion: '血脂指标较前次有所改善，继续保持服药和健康饮食。',
    nextReview: '2个月后复查'
  }
];

export const mockDoctorAdvices: DoctorAdvice[] = [
  {
    id: 'da1',
    content: '血压控制尚可，继续保持每天定时服药。建议低盐低脂饮食，每日食盐控制在5克以内。适度运动，如散步30分钟/天。',
    date: '2026-06-10',
    doctor: '李主任',
    hospital: '市第一人民医院心血管内科'
  },
  {
    id: 'da2',
    content: '空腹血糖略高，建议控制碳水化合物摄入，减少精制米面。多食用绿叶蔬菜，餐后可散步15-20分钟帮助降低血糖。',
    date: '2026-06-10',
    doctor: '张医生',
    hospital: '市第一人民医院内分泌科'
  },
  {
    id: 'da3',
    content: '睡眠质量改善建议：睡前1小时避免使用电子产品，卧室保持安静和适宜温度。如仍有入睡困难，可考虑睡前泡脚或饮用温牛奶。',
    date: '2026-06-10',
    doctor: '王医生',
    hospital: '市中心医院老年科'
  }
];
