import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { getStatusText } from '@/utils';
import type { MedicalAppointment } from '@/types';

interface MedicalCardProps {
  appointment: MedicalAppointment;
  type?: 'appointment' | 'checkup';
  onDetail?: (id: string) => void;
}

const typeTextMap: Record<string, string> = {
  outpatient: '门诊',
  followup: '复诊',
  checkup: '体检',
  emergency: '急诊'
};

const MedicalCard: React.FC<MedicalCardProps> = ({
  appointment,
  type = 'appointment',
  onDetail
}) => {
  const handleClick = () => {
    if (onDetail) {
      onDetail(appointment.id);
    } else if (type === 'checkup') {
      Taro.navigateTo({ url: `/pages/medical/checkup/index?id=${appointment.id}` });
    }
  };

  const statusClass = {
    [styles.statusUpcoming]: appointment.status === 'upcoming',
    [styles.statusCompleted]: appointment.status === 'completed',
    [styles.statusCancelled]: appointment.status === 'cancelled'
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.leftBar} />

      <View className={styles.content}>
        <View className={styles.header}>
          <View className={styles.typeBadge}>
            <Text className={styles.typeText}>{typeTextMap[appointment.type]}</Text>
          </View>
          <View className={classnames(styles.statusBadge, statusClass)}>
            <Text className={styles.statusText}>{getStatusText(appointment.status)}</Text>
          </View>
        </View>

        <Text className={styles.hospital}>{appointment.hospital}</Text>
        <Text className={styles.department}>
          {appointment.department}
          {appointment.doctor && ` · ${appointment.doctor}`}
        </Text>

        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoIcon}>📅</Text>
            <Text className={styles.infoText}>{appointment.date}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoIcon}>🕐</Text>
            <Text className={styles.infoText}>{appointment.time}</Text>
          </View>
        </View>

        {appointment.items && appointment.items.length > 0 && (
          <View className={styles.itemsWrap}>
            {appointment.items.slice(0, 3).map((item, index) => (
              <View key={index} className={styles.itemTag}>
                <Text className={styles.itemText}>{item}</Text>
              </View>
            ))}
            {appointment.items.length > 3 && (
              <View className={styles.itemTag}>
                <Text className={styles.itemText}>+{appointment.items.length - 3}</Text>
              </View>
            )}
          </View>
        )}

        {appointment.notes && (
          <View className={styles.noteRow}>
            <Text className={styles.noteIcon}>📝</Text>
            <Text className={styles.noteText}>{appointment.notes}</Text>
          </View>
        )}
      </View>

      {appointment.status === 'upcoming' && (
        <View className={styles.arrowWrap}>
          <Text className={styles.arrow}>›</Text>
        </View>
      )}
    </View>
  );
};

export default MedicalCard;
