import React, { useState, useMemo } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import { getStatusText, getTodayDate, getCurrentTime } from '@/utils';
import type { HealthStatus } from '@/types';

const getBloodPressureStatus = (systolic: number, diastolic: number): HealthStatus => {
  if (systolic >= 160 || diastolic >= 100) return 'danger';
  if (systolic >= 140 || diastolic >= 90) return 'warning';
  if (systolic < 90 || diastolic < 60) return 'warning';
  return 'normal';
};

const BloodPressurePage: React.FC = () => {
  const { bloodPressureRecords, addBloodPressure } = useAppStore();

  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [pulse, setPulse] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDate());
  const [time, setTime] = useState<string>(getCurrentTime());

  const previewStatus = useMemo(() => {
    const s = Number(systolic);
    const d = Number(diastolic);
    if (!s || !d) return null;
    return getBloodPressureStatus(s, d);
  }, [systolic, diastolic]);

  const isValid = useMemo(() => {
    const s = Number(systolic);
    const d = Number(diastolic);
    return s > 0 && d > 0 && s > d;
  }, [systolic, diastolic]);

  const handleSave = () => {
    if (!isValid) {
      Taro.showToast({ title: '请输入有效的血压值', icon: 'none' });
      return;
    }

    const record = {
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: pulse ? Number(pulse) : undefined,
      date,
      time
    };

    addBloodPressure(record);

    Taro.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>
          <Text className={styles.formIcon}>❤️</Text>
          录入血压
        </Text>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>血压值</Text>
          <View className={styles.inputRow}>
            <View className={styles.inputItem}>
              <View className={styles.inputWrap}>
                <Input
                  className={styles.inputField}
                  type='number'
                  placeholder='收缩压'
                  value={systolic}
                  onInput={(e) => setSystolic(e.detail.value)}
                />
                <Text className={styles.inputUnit}>mmHg</Text>
              </View>
            </View>
            <View className={styles.inputItem}>
              <View className={styles.inputWrap}>
                <Input
                  className={styles.inputField}
                  type='number'
                  placeholder='舒张压'
                  value={diastolic}
                  onInput={(e) => setDiastolic(e.detail.value)}
                />
                <Text className={styles.inputUnit}>mmHg</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.inputGroup}>
          <Text className={styles.inputLabel}>脉搏（选填）</Text>
          <View className={styles.inputWrap}>
            <Input
              className={styles.inputField}
              type='number'
              placeholder='请输入脉搏'
              value={pulse}
              onInput={(e) => setPulse(e.detail.value)}
            />
            <Text className={styles.inputUnit}>次/分</Text>
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
              <Text className={styles.statusValue}>{systolic}/{diastolic} mmHg</Text>
              <Text className={styles.statusLabel}>{pulse ? `脉搏 ${pulse} 次/分` : '当前测量结果'}</Text>
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
          <Text className={styles.sectionCount}>共 {bloodPressureRecords.length} 条</Text>
        </View>

        <View className={styles.historyList}>
          {bloodPressureRecords.slice(0, 10).map((record) => (
            <View key={record.id} className={styles.historyItem}>
              <View className={styles.historyIconWrap}>
                <Text className={styles.historyIcon}>❤️</Text>
              </View>
              <View className={styles.historyInfo}>
                <View className={styles.historyMain}>
                  <Text className={styles.historyValue}>{record.systolic}/{record.diastolic}</Text>
                  <Text className={styles.historyUnit}>mmHg</Text>
                </View>
                <Text className={styles.historySub}>
                  {record.pulse ? `脉搏 ${record.pulse}次/分` : ''}
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

export default BloodPressurePage;
