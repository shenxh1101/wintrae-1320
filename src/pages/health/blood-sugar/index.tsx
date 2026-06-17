import React, { useState, useMemo } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import { getStatusText, getTodayDate, getCurrentTime } from '@/utils';
import type { HealthStatus } from '@/types';

type SugarType = 'fasting' | 'afterMeal' | 'random';

const typeOptions: { key: SugarType; label: string }[] = [
  { key: 'fasting', label: '空腹' },
  { key: 'afterMeal', label: '餐后' },
  { key: 'random', label: '随机' }
];

const getBloodSugarStatus = (value: number, type: string): HealthStatus => {
  if (type === 'fasting') {
    if (value >= 7.0) return 'danger';
    if (value >= 6.1) return 'warning';
    if (value < 3.9) return 'danger';
    return 'normal';
  }
  if (value >= 11.1) return 'danger';
  if (value >= 7.8) return 'warning';
  return 'normal';
};

const getTypeLabel = (type: SugarType): string => {
  const map: Record<SugarType, string> = {
    fasting: '空腹',
    afterMeal: '餐后',
    random: '随机'
  };
  return map[type];
};

const BloodSugarPage: React.FC = () => {
  const { bloodSugarRecords, addBloodSugar } = useAppStore();

  const [value, setValue] = useState<string>('');
  const [type, setType] = useState<SugarType>('fasting');
  const [date, setDate] = useState<string>(getTodayDate());
  const [time, setTime] = useState<string>(getCurrentTime());

  const previewStatus = useMemo(() => {
    const v = Number(value);
    if (!v || v <= 0) return null;
    return getBloodSugarStatus(v, type);
  }, [value, type]);

  const isValid = useMemo(() => {
    const v = Number(value);
    return v > 0;
  }, [value]);

  const handleSave = () => {
    if (!isValid) {
      Taro.showToast({ title: '请输入有效的血糖值', icon: 'none' });
      return;
    }

    const record = {
      value: Number(value),
      type,
      date,
      time
    };

    addBloodSugar(record);

    Taro.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>
          <Text className={styles.formIcon}>🩸</Text>
          录入血糖
        </Text>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>测量类型</Text>
          <View className={styles.typeGroup}>
            {typeOptions.map((opt) => (
              <View
                key={opt.key}
                className={classnames(styles.typeOption, {
                  [styles.active]: type === opt.key
                })}
                onClick={() => setType(opt.key)}
              >
                {opt.label}
              </View>
            ))}
          </View>
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>血糖值</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.inputField}
              type='digit'
              placeholder='请输入血糖值'
              value={value}
              onInput={(e) => setValue(e.detail.value)}
            />
            <Text className={styles.inputUnit}>mmol/L</Text>
          </View>
        </View>

        <View className={styles.dateTimeGroup}>
          <View className={styles.dateTimeItem}>
            <Text className={styles.inputLabel}>日期</Text>
            <View className={styles.inputWrap}>
              <Input
                className={styles.inputField}
                type='text'
                value={date}
                onInput={(e) => setDate(e.detail.value)}
              />
            </View>
          </View>
          <View className={styles.dateTimeItem}>
            <Text className={styles.inputLabel}>时间</Text>
            <View className={styles.inputWrap}>
              <Input
                className={styles.inputField}
                type='text'
                value={time}
                onInput={(e) => setTime(e.detail.value)}
              />
            </View>
          </View>
        </View>

        {previewStatus && (
          <View className={styles.statusPreview}>
            <View className={styles.statusInfo}>
              <Text className={styles.statusValue}>{value} mmol/L</Text>
              <Text className={styles.statusLabel}>{getTypeLabel(type)}测量</Text>
            </View>
            <View
              className={classnames(styles.statusBadge, {
                [styles.statusNormal]: previewStatus === 'normal',
                [styles.statusWarning]: previewStatus === 'warning',
                [styles.statusDanger]: previewStatus === 'danger'
              })}
            >
              <Text className={styles.statusText}>{getStatusText(previewStatus)}</Text>
            </View>
          </View>
        )}

        <View
          className={styles.saveButton}
          onClick={handleSave}
        >
          保存记录
        </View>
      </View>

      <View className={styles.historySection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>历史记录</Text>
          <Text className={styles.sectionCount}>共 {bloodSugarRecords.length} 条</Text>
        </View>

        <View className={styles.historyList}>
          {bloodSugarRecords.slice(0, 10).map((record) => (
            <View key={record.id} className={styles.historyItem}>
              <View className={styles.historyIconWrap}>
                <Text className={styles.historyIcon}>🩸</Text>
              </View>
              <View className={styles.historyInfo}>
                <View className={styles.historyMain}>
                  <Text className={styles.historyValue}>{record.value}</Text>
                  <Text className={styles.historyUnit}>mmol/L</Text>
                </View>
                <Text className={styles.historySub}>
                  {getTypeLabel(record.type as SugarType)}
                </Text>
              </View>
              <View className={styles.historyDate}>
                <Text className={styles.historyDateText}>
                  {record.date} {record.time}
                </Text>
                <View
                  className={classnames(styles.historyStatusBadge, {
                    [styles.statusNormal]: record.status === 'normal',
                    [styles.statusWarning]: record.status === 'warning',
                    [styles.statusDanger]: record.status === 'danger'
                  })}
                >
                  <Text className={styles.historyStatusText}>
                    {getStatusText(record.status)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default BloodSugarPage;
