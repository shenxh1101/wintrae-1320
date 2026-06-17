import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { getStatusText } from '@/utils';

interface HealthCardProps {
  type: 'bloodPressure' | 'bloodSugar' | 'temperature' | 'sleep' | 'water' | 'bowel';
  title: string;
  icon: string;
  value?: string;
  subValue?: string;
  time?: string;
  status?: 'normal' | 'warning' | 'danger';
  actionPath?: string;
  actionText?: string;
  onClick?: () => void;
}

const iconBgMap = {
  bloodPressure: 'rgba(245, 63, 63, 0.1)',
  bloodSugar: 'rgba(255, 125, 0, 0.1)',
  temperature: 'rgba(255, 159, 115, 0.15)',
  sleep: 'rgba(46, 125, 107, 0.12)',
  water: 'rgba(22, 93, 255, 0.1)',
  bowel: 'rgba(92, 179, 154, 0.12)'
};

const iconColorMap = {
  bloodPressure: '#F53F3F',
  bloodSugar: '#FF7D00',
  temperature: '#FF9F73',
  sleep: '#2E7D6B',
  water: '#165DFF',
  bowel: '#5CB39A'
};

const HealthCard: React.FC<HealthCardProps> = ({
  type,
  title,
  icon,
  value,
  subValue,
  time,
  status = 'normal',
  actionPath,
  actionText = '录入',
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (actionPath) {
      Taro.navigateTo({ url: actionPath });
    }
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (actionPath) {
      Taro.navigateTo({ url: actionPath });
    }
  };

  const statusClass = {
    [styles.statusNormal]: status === 'normal',
    [styles.statusWarning]: status === 'warning',
    [styles.statusDanger]: status === 'danger'
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.header}>
        <View
          className={styles.iconWrap}
          style={{
            background: iconBgMap[type],
            color: iconColorMap[type]
          }}
        >
          <Text className={styles.icon}>{icon}</Text>
        </View>
        <View className={styles.titleWrap}>
          <Text className={styles.title}>{title}</Text>
          {time && <Text className={styles.time}>{time}</Text>}
        </View>
        {status !== 'normal' && (
          <View className={classnames(styles.statusBadge, statusClass)}>
            <Text className={styles.statusText}>{getStatusText(status)}</Text>
          </View>
        )}
      </View>

      <View className={styles.body}>
        {value ? (
          <View className={styles.valueWrap}>
            <Text
              className={classnames(styles.value, statusClass)}
              style={{ color: iconColorMap[type] }}
            >
              {value}
            </Text>
            {subValue && <Text className={styles.subValue}>{subValue}</Text>}
          </View>
        ) : (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyText}>暂无今日数据</Text>
          </View>
        )}
      </View>

      <View className={styles.footer}>
        <Button
          className={classnames(styles.actionBtn, 'button-reset')}
          style={{ background: iconBgMap[type], color: iconColorMap[type] }}
          onClick={handleAction}
        >
          <Text className={styles.actionText}>{actionText}</Text>
        </Button>
      </View>
    </View>
  );
};

export default HealthCard;
