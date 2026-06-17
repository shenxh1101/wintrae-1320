import React, { useState, useMemo } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import EmptyState from '@/components/EmptyState';
import { mockWaterRecords } from '@/data/health';
import { getTodayDate, getCurrentTime } from '@/utils';
import type { WaterRecord } from '@/types';

const quickAmounts = [100, 150, 200, 250, 300, 400, 500];

const WaterPage: React.FC = () => {
  const { waterRecords, addWater } = useAppStore();

  const [amount, setAmount] = useState<string>('');

  const allRecords = useMemo(
    () => [...mockWaterRecords, ...waterRecords],
    [waterRecords]
  );

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSave = () => {
    const numAmount = parseInt(amount, 10);
    if (!numAmount || isNaN(numAmount)) {
      Taro.showToast({ title: '请输入饮水量', icon: 'none' });
      return;
    }
    if (numAmount < 10 || numAmount > 2000) {
      Taro.showToast({ title: '饮水量不在合理范围内', icon: 'none' });
      return;
    }

    const recordData: Omit<WaterRecord, 'id'> = {
      amount: numAmount,
      date: getTodayDate(),
      time: getCurrentTime()
    };

    addWater(recordData);

    Taro.showToast({ title: '保存成功', icon: 'success' });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>
          <Text className={styles.formTitleIcon}>💧</Text>
          录入饮水
        </Text>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>饮水量（ml）</Text>
          <View className={styles.formInputWrap}>
            <Input
              className={styles.formInput}
              type='number'
              placeholder='请输入饮水量'
              value={amount}
              onInput={(e) => setAmount(e.detail.value)}
              maxlength={5}
            />
            <Text className={styles.formUnit}>ml</Text>
          </View>
          <Text className={styles.formHint}>每日推荐饮水量：1500 ~ 2000 ml</Text>

          <View className={styles.quickAmountGroup}>
            {quickAmounts.map((value) => (
              <View
                key={value}
                className={classnames(styles.quickAmountBtn, {
                  [styles.quickAmountBtnActive]: amount === value.toString()
                })}
                onClick={() => handleQuickAmount(value)}
              >
                <Text className={styles.quickAmountText}>{value}ml</Text>
              </View>
            ))}
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
                <Text className={styles.recordIcon}>💧</Text>
              </View>
              <View className={styles.recordInfo}>
                <View className={styles.recordMain}>
                  <Text className={styles.recordValue}>{record.amount}</Text>
                  <Text className={styles.recordUnit}>ml</Text>
                </View>
              </View>
              <View className={styles.recordDate}>
                <Text className={styles.recordDateText}>
                  {record.date} {record.time}
                </Text>
                <View className={styles.recordStatusBadge}>
                  <Text className={styles.recordStatusText}>已记录</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState
          icon='💧'
          title='暂无饮水记录'
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

export default WaterPage;
