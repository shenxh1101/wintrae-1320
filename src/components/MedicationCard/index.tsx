import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import type { Medicine } from '@/types';

interface MedicationCardProps {
  medicine: Medicine;
  onToggleTime?: (medicineId: string, timeIndex: number) => void;
  onDetail?: (medicineId: string) => void;
}

const MedicationCard: React.FC<MedicationCardProps> = ({
  medicine,
  onToggleTime,
  onDetail
}) => {
  const isLowStock = medicine.remainingQuantity <= medicine.refillThreshold;
  const usedCount = medicine.takenToday.filter(Boolean).length;
  const progress = (usedCount / medicine.times.length) * 100;

  const handleToggle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleTime) {
      onToggleTime(medicine.id, index);
    }
  };

  const handleDetail = () => {
    if (onDetail) {
      onDetail(medicine.id);
    } else {
      Taro.navigateTo({ url: `/pages/medication/detail/index?id=${medicine.id}` });
    }
  };

  return (
    <View className={styles.card} onClick={handleDetail}>
      <View className={styles.header}>
        <View className={styles.nameRow}>
          <View className={styles.iconWrap}>
            <Text className={styles.icon}>💊</Text>
          </View>
          <View className={styles.nameWrap}>
            <Text className={styles.name}>{medicine.name}</Text>
            <Text className={styles.dosage}>{medicine.dosage} · {medicine.frequency}</Text>
          </View>
        </View>
        {isLowStock && (
          <View className={styles.lowStockBadge}>
            <Text className={styles.lowStockText}>⚠️ 存量不足</Text>
          </View>
        )}
      </View>

      <View className={styles.progressSection}>
        <View className={styles.progressLabel}>
          <Text className={styles.progressText}>今日进度</Text>
          <Text className={styles.progressCount}>{usedCount}/{medicine.times.length} 次</Text>
        </View>
        <View className={styles.progressBar}>
          <View
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <View className={styles.timesRow}>
        {medicine.times.map((time, index) => (
          <Button
            key={index}
            className={classnames(styles.timeBtn, 'button-reset', {
              [styles.timeBtnTaken]: medicine.takenToday[index]
            })}
            onClick={(e) => handleToggle(index, e)}
          >
            <Text className={styles.timeText}>{time}</Text>
            <View className={styles.checkWrap}>
              <Text className={classnames(styles.checkIcon, {
                [styles.checkIconVisible]: medicine.takenToday[index]
              })}>✓</Text>
            </View>
          </Button>
        ))}
      </View>

      <View className={styles.footer}>
        <View className={styles.stockRow}>
          <Text className={styles.stockLabel}>剩余药量</Text>
          <Text className={classnames(styles.stockValue, {
            [styles.stockLow]: isLowStock
          })}>
            {medicine.remainingQuantity} / {medicine.totalQuantity} 片
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MedicationCard;
