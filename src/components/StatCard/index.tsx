import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendText?: string;
  status?: 'normal' | 'warning' | 'danger';
  color?: string;
  bgColor?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  unit,
  trend,
  trendText,
  status = 'normal',
  color,
  bgColor,
  onClick
}) => {
  const statusClass = {
    [styles.statusNormal]: status === 'normal',
    [styles.statusWarning]: status === 'warning',
    [styles.statusDanger]: status === 'danger'
  };

  return (
    <View
      className={classnames(styles.card, statusClass)}
      style={bgColor ? { background: bgColor } : undefined}
      onClick={onClick}
    >
      <View className={styles.iconWrapper} style={color ? { background: color } : undefined}>
        <Text className={styles.icon}>{icon}</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.label}>{label}</Text>
        <View className={styles.valueRow}>
          <Text className={styles.value} style={color ? { color } : undefined}>
            {value}
          </Text>
          {unit && <Text className={styles.unit}>{unit}</Text>}
        </View>
        {(trend || trendText) && (
          <View className={styles.trendRow}>
            {trend && (
              <Text className={classnames(styles.trendIcon, {
                [styles.trendUp]: trend === 'up',
                [styles.trendDown]: trend === 'down'
              })}>
                {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
              </Text>
            )}
            {trendText && <Text className={styles.trendText}>{trendText}</Text>}
          </View>
        )}
      </View>
    </View>
  );
};

export default StatCard;
