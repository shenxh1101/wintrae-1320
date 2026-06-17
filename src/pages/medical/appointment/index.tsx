import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import type { MedicalAppointment } from '@/types';

const AppointmentPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id;
  const { appointments } = useAppStore();

  const appointment: MedicalAppointment | undefined = useMemo(() => {
    return appointments.find(a => a.id === id);
  }, [id, appointments]);

  const getTypeText = (type: string) => {
    const map: Record<string, string> = {
      outpatient: '门诊',
      followup: '复诊',
      checkup: '体检',
      emergency: '急诊'
    };
    return map[type] || type;
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      upcoming: '待就诊',
      completed: '已完成',
      cancelled: '已取消'
    };
    return map[status] || status;
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '取消预约',
      content: '确定要取消该预约吗？取消后需重新预约。',
      confirmText: '确认取消',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '预约已取消', icon: 'success' });
        }
      }
    });
  };

  const handleNavigate = () => {
    Taro.showToast({ title: '正在打开地图导航...', icon: 'none' });
  };

  const handleReminder = () => {
    Taro.showActionSheet({
      itemList: ['提前1小时提醒', '提前2小时提醒', '提前1天提醒', '不提前提醒'],
      success: (res) => {
        const options = ['提前1小时', '提前2小时', '提前1天', '不提醒'];
        Taro.showToast({
          title: `已设置${options[res.tapIndex]}`,
          icon: 'success'
        });
      }
    });
  };

  if (!appointment) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text>预约信息不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <View className={styles.statusBadge}>
          <Text className={styles.statusBadgeText}>{getStatusText(appointment.status)}</Text>
        </View>
        <Text className={styles.hospital}>{appointment.hospital}</Text>
        <Text className={styles.dept}>
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
        <View className={styles.typeTags}>
          <View className={styles.typeTag}>
            <Text className={styles.typeTagText}>{getTypeText(appointment.type)}</Text>
          </View>
        </View>
      </View>

      <View className={styles.contentArea}>
        {appointment.items && appointment.items.length > 0 && (
          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionTitleIcon}>📋</Text>
              <Text className={styles.sectionTitleText}>检查项目</Text>
            </View>
            <View className={styles.itemList}>
              {appointment.items.map((item, idx) => (
                <View key={idx} className={styles.itemRow}>
                  <View className={styles.itemDot} />
                  <Text className={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {appointment.notes && (
          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionTitleIcon}>📝</Text>
              <Text className={styles.sectionTitleText}>备注信息</Text>
            </View>
            <View className={styles.notesCard}>
              <Text className={styles.notesText}>{appointment.notes}</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.btn, styles.btnCancel)}
          onClick={handleCancel}
        >
          <Text className={styles.btnCancelText}>取消预约</Text>
        </View>
        <View
          className={classnames(styles.btn, styles.btnSecondary)}
          onClick={handleReminder}
        >
          <Text className={styles.btnSecondaryText}>提前提醒</Text>
        </View>
        <View
          className={classnames(styles.btn, styles.btnPrimary)}
          onClick={handleNavigate}
        >
          <Text className={styles.btnPrimaryText}>导航到医院</Text>
        </View>
      </View>
    </View>
  );
};

export default AppointmentPage;
