import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import EmptyState from '@/components/EmptyState';
import { getStatusText, getTodayDate, getCurrentTime } from '@/utils';
import type { HealthStatus } from '@/types';

const TemperaturePage: React.FC = () => {
  const { temperatureRecords, addTemperature } = useAppStore();

  const [value, setValue] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const handleSave = () => {
    const numValue = parseFloat(value);
    if (!numValue || isNaN(numValue)) {
      Taro.showToast({ title: '请输入体温数值', icon: 'none' });
      return;
    }
    if (numValue < 34 || numValue > 43) {
      Taro.showToast({ title: '体温数值不在合理范围内', icon: 'none' });
      return;
    }

    const recordData: Omit<any, 'id' | 'status'> = {
      value: numValue,
      date: getTodayDate(),
      time: getCurrentTime(),
      ...(note.trim() ? { note: note.trim() } : {})
    };

    addTemperature(recordData);

    Taro.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>
          <Text className={styles.formTitleIcon}>🌡️</Text>
          录入体温
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>体温（°C）</Text>
          <View className={styles.formInputWrap}>
            <Input
              className={styles.formInput}
              type='digit'
              placeholder='请输入体温'
              value={value}
              onInput={(e) => setValue(e.detail.value)}
              maxlength={5}
            />
            <Text className={styles.formUnit}>°C</Text>
          </View>
          <Text className={styles.formHint}>正常范围：36.0°C ~ 37.2°C</Text>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>备注（选填）</Text>
          <View className={styles.formTextareaWrap}>
            <Textarea
              className={styles.formTextarea}
              placeholder='如有特殊情况请说明，如：晨起测量、活动后等'
              value={note}
              onInput={(e) => setNote(e.detail.value)}
              maxlength={200}
            />
          </View>
        </View>
      </View>

      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>历史记录</Text>
        <Text className={styles.sectionCount}>共 {temperatureRecords.length} 条</Text>
      </View>

      {temperatureRecords.length > 0 ? (
        <View className={styles.recordList}>
          {temperatureRecords.map((record) => (
            <View key={record.id} className={styles.recordItem}>
              <View className={styles.recordIconWrap}>
                <Text className={styles.recordIcon}>🌡️</Text>
              </View>
              <View className={styles.recordInfo}>
                <View className={styles.recordMain}>
                  <Text className={styles.recordValue}>{record.value}</Text>
                  <Text className={styles.recordUnit}>°C</Text>
                </View>
                {record.note && <Text className={styles.recordNote}>{record.note}</Text>}
              </View>
              <View className={styles.recordDate}>
                <Text className={styles.recordDateText}>
                  {record.date} {record.time}
                </Text>
                <View
                  className={classnames(styles.recordStatusBadge, {
                    [styles.statusNormal]: record.status === 'normal',
                    [styles.statusWarning]: record.status === 'warning',
                    [styles.statusDanger]: record.status === 'danger'
                  })}
                >
                  <Text className={styles.recordStatusText}>
                    {getStatusText(record.status as string)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState
          icon='🌡️'
          title='暂无体温记录'
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

export default TemperaturePage;
