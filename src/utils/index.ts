import dayjs from 'dayjs';

export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const formatTime = (date: string | Date, format: string = 'HH:mm'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, format: string = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(date).format(format);
};

export const formatRelativeTime = (timestamp: string): string => {
  const now = dayjs();
  const target = dayjs(timestamp);
  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  if (diffMinutes < 1) return '刚刚';
  if (diffMinutes < 60) return `${diffMinutes}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return formatDate(timestamp);
};

export const getTodayDate = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

export const getCurrentTime = (): string => {
  return dayjs().format('HH:mm');
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    normal: '正常',
    warning: '偏高',
    danger: '异常',
    good: '良好',
    poor: '较差',
    upcoming: '待就诊',
    completed: '已完成',
    cancelled: '已取消',
    pending: '待完成'
  };
  return statusMap[status] || status;
};

export const getStatusColorClass = (status: string): string => {
  const colorMap: Record<string, string> = {
    normal: 'statusNormal',
    warning: 'statusWarning',
    danger: 'statusDanger',
    good: 'statusNormal',
    poor: 'statusDanger',
    upcoming: 'statusWarning',
    completed: 'statusNormal',
    cancelled: 'statusDisabled',
    pending: 'statusWarning'
  };
  return colorMap[status] || 'statusNormal';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

export const round = (num: number, decimals: number = 1): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

export const average = (arr: number[]): number => {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

export const getHealthTextColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    normal: '#00B42A',
    warning: '#FF7D00',
    danger: '#F53F3F'
  };
  return colorMap[status] || '#1D2129';
};
