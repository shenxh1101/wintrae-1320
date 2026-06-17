import React, { useState, useMemo } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import EmptyState from '@/components/EmptyState';
import { mockSleepRecords } from '@/data/health';
import { getTodayDate } from '@/utils';
import type { SleepRecord } from '@/types';

type SleepQuality = 'good' | 'normal' | 'poor';

const qualityOptions: { key: SleepQuality; icon: string; text: string }[] = [
  { key: 'good', icon: '😊', text: '良好' },
  { key: 'normal', icon: '😐', text: '一般' },
  { key: 'poor', icon: '😫', text: '较差' }
];

const getRecordStatus = (quality: SleepQuality): string => {
  if (quality === 'poor') return 'danger';
  if (quality === 'normal') return 'warning';
  return 'normal';
};

const getQualityText = (quality: SleepQuality): string => {
  const map: Record<SleepQuality, string> = {
    good: '良好',
    normal: '一般',
    poor: '较差'
  };
  return map[quality];
};

const SleepPage: React.FC = () => {
  const { sleepRecords, addSleep } = useAppStore();

  const [duration, setDuration] = useState<string>('');
  const [quality, setQuality] = useState<SleepQuality>('good');
  const [note, setNote] = useState<string>('');

  const allRecords = useMemo(
    () => [...mockSleepRecords, ...sleepRecords],
    [sleepRecords]
  );

  const handleQualitySelect = (key: SleepQuality) => {
    setQuality(key);
  };

  const handleSave = () => {
    const numDuration = parseFloat(duration);
    if (!numDuration || isNaN(numDuration)) {
      Taro.showToast({ title: '请输入睡眠时长', icon: 'none' });
      return;
    }
    if (numDuration < 0 || numDuration > 24) {
      Taro.showToast({ title: '睡眠时长不在合理范围内', icon: 'none' });
      return;
    }

    const recordData: Omit<SleepRecord, 'id'> = {
      duration: numDuration,
      quality,
      date: getTodayDate(),
      ...(note.trim() ? { note: note.trim() } : {})
    };

    addSleep(recordData);

    Taro.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>
          <Text className={styles.formTitleIcon}>😴</Text>
          录入睡眠
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>睡眠时长（小时）</Text>
          <View className={styles.formInputWrap}>
            <Input
              className={styles.formInput}
              type='digit'
              placeholder='请输入睡眠时长'
              value={duration}
              onInput={(e) => setDuration(e.detail.value)}
              maxlength={4}
            />
            <Text className={styles.formUnit}>小时</Text>
          </View>
          <Text className={styles.formHint}>推荐睡眠时长：7 ~ 9 小时</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>睡眠质量</Text>
          <View className={styles.qualityGroup}>
            {qualityOptions.map((option) => (
              <View
                key={option.key}
                className={classnames(styles.qualityOption, {
                  [styles.qualityOptionActive]: quality === option.key,
                  [styles.qualityGoodActive]: quality === option.key && option.key === 'good',
                  [styles.qualityNormalActive]: quality === option.key && option.key === 'normal',
                  [styles.qualityPoorActive]: quality === option.key && option.key === 'poor'
                })}
                onClick={() => handleQualitySelect(option.key)}
              >
                <Text className={styles.qualityIcon}>{option.icon}</Text>
                <Text className={styles.qualityText}>{option.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>备注（选填）</Text>
          <View className={styles.formTextareaWrap}>
            <Textarea
              className={styles.formTextarea}
              placeholder='如有特殊情况请说明，如：夜醒、多梦等'
              value={note}
              onInput={(e) => setNote(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>历史记录</Text>
        <Text className={styles.sectionCount}>共 {allRecords.length} 条</Text>
      </View>

      {allRecords.length > 0 ? (
        <View className={styles.recordList}>
          {allRecords.map((record) => (
            <View key={record.id} className={styles.recordItem}>
              <View className={styles.recordIconWrap}>
                <Text className={styles.recordIcon}>😴</Text>
              </View>
              <View className={styles.recordInfo}>
                <View className={styles.recordMain}>
                  <Text className={styles.recordValue}>{record.duration}</Text>
                  <Text className={styles.recordUnit}>小时</Text>
                </View>
                <Text className={styles.recordNote}>
                  质量：{getQualityText(record.quality as SleepQuality)}
                  {record.note ? ` · ${record.note}` : ''}
                </Text>
              </View>
              <View className={styles.recordDate}>
                <Text className={styles.recordDateText}>{record.date}</Text>
                <View
                  className={classnames(styles.recordStatusBadge, {
                    [styles.statusNormal]: getRecordStatus(record.quality as SleepQuality) === 'normal',
                    [styles.statusWarning]: getRecordStatus(record.quality as SleepQuality) === 'warning',
                    [styles.statusDanger]: getRecordStatus(record.quality as SleepQuality) === 'danger'
                  })}
                >
                  <Text className={styles.recordStatusText}>
                    {getQualityText(record.quality as SleepQuality)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState
          icon='😴'
          title='暂无睡眠记录'
          description='填写上方表单后点击保存添加第一条记录'
        />
      )}

      <View className={styles.bottomBar}>
        <Button className={styles.saveBtn} onClick={handleSave}>
          保存记录
        </Button>
      </View>
    </View>
  );
};

export default SleepPage;
