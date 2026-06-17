import React, { useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import SectionHeader from '@/components/SectionHeader';
import MedicationCard from '@/components/MedicationCard';
import EmptyState from '@/components/EmptyState';
import { mockMedicines } from '@/data/medication';
import { getTodayDate } from '@/utils';

const MedicationPage: React.FC = () => {
  const { medicines, toggleMedicineTaken, addMedicine } = useAppStore();
  const today = getTodayDate();

  const allMedicines = useMemo(
    () => [...mockMedicines, ...medicines],
    [medicines]
  );

  const lowStockMedicines = useMemo(
    () => allMedicines.filter(m => m.remainingQuantity <= m.refillThreshold),
    [allMedicines]
  );

  const totalDoses = useMemo(
    () => allMedicines.reduce((sum, m) => sum + m.times.length, 0),
    [allMedicines]
  );

  const takenDoses = useMemo(
    () => allMedicines.reduce((sum, m) => sum + m.takenToday.filter(Boolean).length, 0),
    [allMedicines]
  );

  const complianceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  const handleAddMedicine = () => {
    Taro.navigateTo({ url: '/pages/medication/add/index' });
  };

  const handleRefill = (name: string) => {
    Taro.showToast({
      title: `已提醒复购${name}`,
      icon: 'none'
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.todaySummary}>
        <View className={styles.summaryHeader}>
          <View className={styles.summaryTitle}>
            <Text className={styles.summaryIcon}>📅</Text>
            <Text className={styles.summaryTitleText}>今日用药</Text>
          </View>
          <Text className={styles.summaryDate}>{today}</Text>
        </View>

        <View className={styles.summaryStats}>
          <View className={styles.summaryStatItem}>
            <Text className={styles.summaryStatValue}>{allMedicines.length}</Text>
            <Text className={styles.summaryStatLabel}>药品数量</Text>
          </View>
          <View className={styles.summaryStatItem}>
            <Text className={styles.summaryStatValue}>{takenDoses}/{totalDoses}</Text>
            <Text className={styles.summaryStatLabel}>已服/待服</Text>
          </View>
          <View className={styles.summaryStatItem}>
            <Text className={styles.summaryStatValue}>{complianceRate}%</Text>
            <Text className={styles.summaryStatLabel}>依从率</Text>
          </View>
        </View>

        <View className={styles.summaryProgress}>
          <View
            className={styles.summaryProgressFill}
            style={{ width: `${complianceRate}%` }}
          />
        </View>
        <Text className={styles.summaryProgressText}>完成进度 {complianceRate}%</Text>
      </View>

      {lowStockMedicines.length > 0 && (
        <View className={styles.refillSection}>
          <View className={styles.refillHeader}>
            <Text className={styles.refillIcon}>⚠️</Text>
            <Text className={styles.refillTitle}>
              药品存量不足（{lowStockMedicines.length}种需复购）
            </Text>
          </View>
          <View className={styles.refillList}>
            {lowStockMedicines.map(med => (
              <View key={med.id} className={styles.refillItem}>
                <View>
                  <Text className={styles.refillItemName}>{med.name}</Text>
                  <Text className={styles.refillItemStock}>
                    仅剩 {med.remainingQuantity} 片
                  </Text>
                </View>
                <Button
                  className={classnames(styles.refillBtn, 'button-reset')}
                  onClick={() => handleRefill(med.name)}
                >
                  <Text className={styles.refillBtnText}>提醒复购</Text>
                </Button>
              </View>
            ))}
          </View>
        </View>
      )}

      <SectionHeader
        title="全部药品"
        subtitle={`共${allMedicines.length}种`}
        showAction={false}
      />

      {allMedicines.length > 0 ? (
        <View className={styles.medicineList}>
          {allMedicines.map(med => (
            <MedicationCard
              key={med.id}
              medicine={med}
              onToggleTime={(id, idx) => toggleMedicineTaken(id, idx)}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon="💊"
          title="暂无药品"
          description="添加老人正在服用的药品，设置服药时间提醒"
          actionText="添加药品"
          onAction={handleAddMedicine}
        />
      )}

      <View className={styles.addFab} onClick={handleAddMedicine}>
        <Text className={styles.addFabText}>+</Text>
      </View>
    </View>
  );
};

export default MedicationPage;
