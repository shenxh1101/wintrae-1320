import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';
import { mockCheckupRecords } from '@/data/medical';
import type { CheckupRecord, HealthStatus } from '@/types';

const CheckupPage: React.FC = () => {
  const record: CheckupRecord | undefined = useMemo(() => {
    return mockCheckupRecords[0];
  }, []);

  const getStats = useMemo(() => {
    if (!record) return { normal: 0, warning: 0, danger: 0 };
    const normal = record.items.filter(i => i.status === 'normal').length;
    const warning = record.items.filter(i => i.status === 'warning').length;
    const danger = record.items.filter(i => i.status === 'danger').length;
    return { normal, warning, danger };
  }, [record]);

  const getStatusClass = (status: HealthStatus) => {
    const map: Record<HealthStatus, string> = {
      normal: styles.statusNormal,
      warning: styles.statusWarning,
      danger: styles.statusDanger
    };
    return map[status];
  };

  const getStatusText = (status: HealthStatus) => {
    const map: Record<HealthStatus, string> = {
      normal: '正常',
      warning: '偏高',
      danger: '异常'
    };
    return map[status];
  };

  const getValueClass = (status: HealthStatus) => {
    const map: Record<HealthStatus, string> = {
      normal: styles.valueNormal,
      warning: styles.valueWarning,
      danger: styles.valueDanger
    };
    return map[status];
  };

  if (!record) {
    return (
      <View className={styles.page}>
        <View style={{ padding: '100rpx', textAlign: 'center' }}>
          <Text>检查单信息不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <View className={styles.titleRow}>
          <Text className={styles.title}>{record.title}</Text>
        </View>
        <Text className={styles.hospital}>{record.hospital}</Text>
        <View className={styles.dateRow}>
          <Text className={styles.dateIcon}>📅</Text>
          <Text className={styles.dateText}>检查日期：{record.date}</Text>
        </View>
        <View className={styles.statsRow}>
          <View className={styles.statsItem}>
            <Text className={classnames(styles.statsValue, styles.valueNormal)}>
              {getStats.normal}
            </Text>
            <Text className={styles.statsLabel}>正常</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={classnames(styles.statsValue, styles.valueWarning)}>
              {getStats.warning}
            </Text>
            <Text className={styles.statsLabel}>偏高</Text>
          </View>
          <View className={styles.statsItem}>
            <Text className={classnames(styles.statsValue, styles.valueDanger)}>
              {getStats.danger}
            </Text>
            <Text className={styles.statsLabel}>异常</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionTitleIcon}>🔬</Text>
            <Text className={styles.sectionTitleText}>检查项目</Text>
          </View>
        </View>
        <View className={styles.itemList}>
          {record.items.map((item, idx) => (
            <View key={idx} className={styles.itemRow}>
              <View className={styles.itemInfo}>
                <Text className={styles.itemName}>{item.name}</Text>
                {item.referenceRange && (
                  <Text className={styles.itemRef}>参考范围：{item.referenceRange}</Text>
                )}
              </View>
              <View className={styles.itemValueWrap}>
                <Text className={classnames(styles.itemValue, getValueClass(item.status))}>
                  {item.value}
                </Text>
                <View className={classnames(styles.statusBadge, getStatusClass(item.status))}>
                  <Text className={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {record.overallConclusion && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionTitleIcon}>📋</Text>
              <Text className={styles.sectionTitleText}>总体结论</Text>
            </View>
          </View>
          <View className={styles.conclusionCard}>
            <Text className={styles.conclusionText}>{record.overallConclusion}</Text>
          </View>
        </View>
      )}

      {record.nextReview && (
        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionTitleIcon}>🔄</Text>
              <Text className={styles.sectionTitleText}>复查建议</Text>
            </View>
          </View>
          <View className={styles.reviewCard}>
            <Text className={styles.reviewIcon}>📆</Text>
            <Text className={styles.reviewText}>{record.nextReview}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CheckupPage;
