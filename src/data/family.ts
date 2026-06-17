import type { FamilyMember, CareMessage, CareTask } from '@/types';

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'f1',
    name: '李建华',
    role: '大儿子',
    phone: '138****1234',
    relationship: 'child',
    isAuthorized: true
  },
  {
    id: 'f2',
    name: '李建芳',
    role: '小女儿',
    phone: '139****5678',
    relationship: 'child',
    isAuthorized: true
  },
  {
    id: 'f3',
    name: '王淑芬',
    role: '老伴',
    phone: '136****9012',
    relationship: 'spouse',
    isAuthorized: true
  },
  {
    id: 'f4',
    name: '张阿姨',
    role: '住家保姆',
    phone: '137****3456',
    relationship: 'other',
    isAuthorized: false
  }
];

export const mockCareMessages: CareMessage[] = [
  {
    id: 'cm1',
    senderId: 'f2',
    senderName: '李建芳',
    senderRole: '小女儿',
    content: '妈妈今天血压有点高，早上145/92，记得提醒她按时吃药，多休息，下午我下班后过去看看。',
    timestamp: '2026-06-18T08:30:00Z',
    isRead: false
  },
  {
    id: 'cm2',
    senderId: 'f1',
    senderName: '李建华',
    senderRole: '大儿子',
    content: '已预约6月22日上午9:30市一院心内科李主任的号，我会请假陪同妈妈过去，记得带上最近的血压记录。',
    timestamp: '2026-06-17T20:15:00Z',
    isRead: true
  },
  {
    id: 'cm3',
    senderId: 'f3',
    senderName: '王淑芬',
    senderRole: '老伴',
    content: '今天妈妈胃口不错，中午吃了一碗粥和小半条鱼，下午在小区花园走了两圈，精神挺好的。',
    timestamp: '2026-06-17T17:45:00Z',
    isRead: true
  },
  {
    id: 'cm4',
    senderId: 'f2',
    senderName: '李建芳',
    senderRole: '小女儿',
    content: '买了一些妈妈爱吃的软面包和无糖麦片，明天快递应该到了，注意查收。',
    timestamp: '2026-06-16T19:20:00Z',
    isRead: true
  }
];

export const mockCareTasks: CareTask[] = [
  {
    id: 'ct1',
    title: '陪同复诊',
    description: '6月22日上午9:30陪同妈妈去市一院心内科李主任处复诊，携带血压记录本和体检报告',
    assignedTo: 'f1',
    assignedName: '李建华',
    dueDate: '2026-06-22',
    status: 'pending'
  },
  {
    id: 'ct2',
    title: '购买药品',
    description: '阿托伐他汀钙片余量不足，需要尽快去医院配药或药店购买',
    assignedTo: 'f2',
    assignedName: '李建芳',
    dueDate: '2026-06-20',
    status: 'pending'
  },
  {
    id: 'ct3',
    title: '购买生活用品',
    description: '帮妈妈买：成人护理垫、湿纸巾、软毛牙刷、无糖饼干',
    assignedTo: 'f2',
    assignedName: '李建芳',
    dueDate: '2026-06-18',
    status: 'completed',
    completedBy: '李建芳',
    completedAt: '2026-06-17T16:00:00Z'
  },
  {
    id: 'ct4',
    title: '整理检查单据',
    description: '将最近一个月的检查单、化验单整理归档，复诊时带给医生',
    assignedTo: 'f3',
    assignedName: '王淑芬',
    dueDate: '2026-06-21',
    status: 'pending'
  }
];
