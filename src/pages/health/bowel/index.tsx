import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import EmptyState from '@/components/EmptyState';
import { getTodayDate } from '@/utils';
import type { BowelRecord } from '@/types';

type BowelConsistency = 'normal' | 'hard' | 'loose';

const consistencyOptions: { key: BowelConsistency; icon: string; text: string }[] = [
  { key: 'normal', icon: '✅', text: '正常' },
  { key: 'hard', icon: '🌵', text: '偏干' },
  { key: 'loose', icon: '💧', text: '偏稀' }
];

const frequencyOptions = [0, 1, 2, 3, 4];

const getRecordStatus = (consistency: BowelConsistency): string => {
  if (consistency === 'normal') return 'normal';
  return 'warning';
};

const getConsistencyText = (consistency: BowelConsistency): string => {
  const map: Record<BowelConsistency, string> = {
    normal: '正常',
    hard: '偏干',
    loose: '偏稀'
  };
  return map[consistency];
};

const BowelPage: React.FC = () => {
  const { bowelRecords, addBowel } = useAppStore();

  const [frequency, setFrequency] = useState<string>('');
  const [consistency, setConsistency] = useState<BowelConsistency>('normal');
  const [note, setNote] = useState<string>('');

  const handleConsistencySelect = (key: BowelConsistency) => {
    setConsistency(key);
  };

  const handleFrequencySelect = (value: number) => {
    setFrequency(value.toString());
  };

  const handleSave = () => {
    const numFrequency = parseInt(frequency, 10);
    if (frequency === '' || isNaN(numFrequency)) {
      Taro.showToast({ title: '请输入排便次数', icon: 'none' });
      return;
    }
    if (numFrequency < 0 || numFrequency > 10) {
      Taro.showToast({ title: '排便次数不在合理范围内', icon: 'none' });
      return;
    }

    const recordData: Omit<BowelRecord, 'id'> = {
      frequency: numFrequency,
      consistency,
      date: getTodayDate(),
      ...(note.trim() ? { note: note.trim() } : {})
    };

    addBowel(recordData);

    Taro.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>
          <Text className={styles.formTitleIcon}>💩</Text>
          录入排便
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>排便次数（次）</Text>
          <View className={styles.formInputWrap}>
            <Input
              className={styles.formInput}
              type='number'
              placeholder='请输入排便次数'
              value={frequency}
              onInput={(e) => setFrequency(e.detail.value)}
              maxlength={2}
            />
            <Text className={styles.formUnit}>次</Text>
          </View>
          <Text className={styles.formHint}>正常范围：每日 1 ~ 2 次</Text>

          <View className={styles.frequencyQuickGroup}>
            {frequencyOptions.map((value) => (
              <View
                key={value}
                className={classnames(styles.frequencyQuickBtn, {
                  [styles.frequencyQuickBtnActive]: frequency === value.toString()
                })}
                onClick={() => handleFrequencySelect(value)}
              >
                <Text className={styles.frequencyQuickText}>{value}次</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>性状</Text>
          <View className={styles.consistencyGroup}>
            {consistencyOptions.map((option) => (
              <View
                key={option.key}
                className={classnames(styles.consistencyOption, {
                  [styles.consistencyOptionActive]: consistency === option.key,
                  [styles.consistencyNormalActive]: consistency === option.key && option.key === 'normal',
                  [styles.consistencyHardActive]: consistency === option.key && option.key === 'hard',
                  [styles.consistencyLooseActive]: consistency === option.key && option.key === 'loose'
                })}
                onClick={() => handleConsistencySelect(option.key)}
              >
                <Text className={styles.consistencyIcon}>{option.icon}</Text>
                <Text className={styles.consistencyText}>{option.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>备注（选填）</Text>
          <View className={styles.formTextareaWrap}>
            <Textarea
              className={styles.formTextarea}
              placeholder='如有特殊情况请说明，如：腹痛、便血等'
              value={note}
              onInput={(e) => setNote(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>历史记录</Text>
        <Text className={styles.sectionCount}>共 {bowelRecords.length} 条</Text>
      </View>

      {bowelRecords.length > 0 ? (
        <View className={styles.recordList}>
          {bowelRecords.map((record) => (
            <View key={record.id} className={styles.recordItem}>
              <View className={styles.recordIconWrap}>
                <Text className={styles.recordIcon}>💩</Text>
              </View>
              <View className={styles.recordInfo}>
                <View className={styles.recordMain}>
                  <Text className={styles.recordValue}>{record.frequency}</Text>
                  <Text className={styles.recordUnit}>次</Text>
                </View>
                <Text className={styles.recordNote}>
                  性状：{getConsistencyText(record.consistency as BowelConsistency)}
                  {record.note ? ` · ${record.note}` : ''}
                </Text>
              </View>
              <View className={styles.recordDate}>
                <Text className={styles.recordDateText}>{record.date}</Text>
                <View
                  className={classnames(styles.recordStatusBadge, {
                    [styles.statusNormal]: getRecordStatus(record.consistency as BowelConsistency) === 'normal',
                    [styles.statusWarning]: getRecordStatus(record.consistency as BowelConsistency) === 'warning'
                  })}
                >
                  <Text className={styles.recordStatusText}>
                    {getConsistencyText(record.consistency as BowelConsistency)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState
          icon='💩'
          title='暂无排便记录'
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

export default BowelPage;
