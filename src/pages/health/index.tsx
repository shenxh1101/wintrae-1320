import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import EmptyState from '@/components/EmptyState';
import { average, getStatusText } from '@/utils';
import type { HealthStatus } from '@/types';

const healthTypes = [
  {
    key: 'bloodPressure',
    title: '血压',
    icon: '❤️',
    bg: 'rgba(245, 63, 63, 0.1)',
    color: '#F53F3F',
    path: '/pages/health/blood-pressure/index'
  },
  {
    key: 'bloodSugar',
    title: '血糖',
    icon: '🩸',
    bg: 'rgba(255, 125, 0, 0.1)',
    color: '#FF7D00',
    path: '/pages/health/blood-sugar/index'
  },
  {
    key: 'temperature',
    title: '体温',
    icon: '🌡️',
    bg: 'rgba(255, 159, 115, 0.15)',
    color: '#FF9F73',
    path: '/pages/health/temperature/index'
  },
  {
    key: 'sleep',
    title: '睡眠',
    icon: '😴',
    bg: 'rgba(46, 125, 107, 0.12)',
    color: '#2E7D6B',
    path: '/pages/health/sleep/index'
  },
  {
    key: 'water',
    title: '饮水',
    icon: '💧',
    bg: 'rgba(22, 93, 255, 0.1)',
    color: '#165DFF',
    path: '/pages/health/water/index'
  },
  {
    key: 'bowel',
    title: '排便',
    icon: '💩',
    bg: 'rgba(92, 179, 154, 0.12)',
    color: '#5CB39A',
    path: '/pages/health/bowel/index'
  }
];

const HealthPage: React.FC = () => {
  const {
    bloodPressureRecords,
    bloodSugarRecords,
    temperatureRecords,
    sleepRecords,
    waterRecords,
    bowelRecords
  } = useAppStore();

  const [activeType, setActiveType] = useState<string>('bloodPressure');

  const allBp = bloodPressureRecords;
  const allBs = bloodSugarRecords;
  const allTemp = temperatureRecords;
  const allSleep = sleepRecords;
  const allWater = waterRecords;
  const allBowel = bowelRecords;

  const recentBp = allBp.slice(0, 7);
  const avgSystolic = useMemo(
    () => Math.round(average(recentBp.map(r => r.systolic))),
    [recentBp]
  );
  const avgDiastolic = useMemo(
    () => Math.round(average(recentBp.map(r => r.diastolic))),
    [recentBp]
  );
  const avgBs = useMemo(
    () => average(allBs.slice(0, 7).map(r => r.value)).toFixed(1),
    [allBs]
  );
  const avgTemp = useMemo(
    () => average(allTemp.slice(0, 7).map(r => r.value)).toFixed(1),
    [allTemp]
  );

  const weeklyAbnormal = useMemo(() => {
    let count = 0;
    count += recentBp.filter(r => r.status !== 'normal').length;
    count += allBs.slice(0, 7).filter(r => r.status !== 'normal').length;
    count += allTemp.slice(0, 7).filter(r => r.status !== 'normal').length;
    return count;
  }, [recentBp, allBs, allTemp]);

  const avgSleep = useMemo(
    () => average(allSleep.slice(0, 7).map(r => r.duration)).toFixed(1),
    [allSleep]
  );

  const currentRecords = useMemo(() => {
    switch (activeType) {
      case 'bloodPressure':
        return allBp.map(r => ({
          ...r,
          value: `${r.systolic}/${r.diastolic}`,
          unit: 'mmHg',
          sub: r.pulse ? `脉搏 ${r.pulse}次/分` : '',
          date: r.date,
          time: r.time
        }));
      case 'bloodSugar':
        return allBs.map(r => ({
          ...r,
          value: r.value.toString(),
          unit: 'mmol/L',
          sub: r.type === 'fasting' ? '空腹' : r.type === 'afterMeal' ? '餐后' : '随机',
          date: r.date,
          time: r.time
        }));
      case 'temperature':
        return allTemp.map(r => ({
          ...r,
          value: r.value.toString(),
          unit: '°C',
          sub: '',
          date: r.date,
          time: r.time
        }));
      case 'sleep':
        return allSleep.map(r => ({
          ...r,
          status: r.quality === 'poor' ? 'danger' : r.quality === 'normal' ? 'warning' : 'normal',
          value: r.duration.toString(),
          unit: '小时',
          sub: `质量：${r.quality === 'good' ? '良好' : r.quality === 'normal' ? '一般' : '较差'}`,
          date: r.date,
          time: ''
        }));
      case 'water':
        return allWater.map(r => ({
          ...r,
          status: 'normal' as HealthStatus,
          value: r.amount.toString(),
          unit: 'ml',
          sub: '',
          date: r.date,
          time: r.time
        }));
      case 'bowel':
        return allBowel.map(r => ({
          ...r,
          status: r.consistency === 'normal' ? 'normal' : 'warning',
          value: r.frequency.toString(),
          unit: '次',
          sub: r.consistency === 'normal' ? '正常' : r.consistency === 'hard' ? '偏干' : '偏稀',
          date: r.date,
          time: ''
        }));
      default:
        return [];
    }
  }, [activeType, allBp, allBs, allTemp, allSleep, allWater, allBowel]);

  const currentTypeConfig = healthTypes.find(t => t.key === activeType)!;

  const handleTypeClick = (typeKey: string, path: string) => {
    setActiveType(typeKey);
  };

  const handleGotoRecord = (path: string) => {
    Taro.navigateTo({ url: path });
  };

  return (
    <View className={styles.page}>
      <View className={styles.weekCard} onClick={() => handleGotoRecord('/pages/health/weekly-report/index')}>
        <View className={styles.weekHeader}>
          <Text className={styles.weekTitle}>📊 本周健康周报</Text>
          <Text className={styles.weekDate}>6月12日 - 6月18日</Text>
        </View>

        <View className={styles.weekStats}>
          <View className={styles.weekStatItem}>
            <Text className={styles.weekStatValue}>{avgSystolic}/{avgDiastolic}</Text>
            <Text className={styles.weekStatLabel}>平均血压</Text>
          </View>
          <View className={styles.weekStatItem}>
            <Text className={styles.weekStatValue}>{avgBs}</Text>
            <Text className={styles.weekStatLabel}>平均血糖</Text>
          </View>
          <View className={styles.weekStatItem}>
            <Text className={styles.weekStatValue}>{avgSleep}h</Text>
            <Text className={styles.weekStatLabel}>平均睡眠</Text>
          </View>
        </View>

        {weeklyAbnormal > 0 && (
          <View className={styles.weekAlerts}>
            <View className={styles.weekAlertTitle}>
              <Text className={styles.weekAlertIcon}>⚠️</Text>
              <Text className={styles.weekAlertTitleText}>需关注事项（{weeklyAbnormal}项）</Text>
            </View>
            <View className={styles.weekAlertList}>
              <Text className={styles.weekAlertItem}>血压有3次测量偏高，建议按时服药</Text>
              <Text className={styles.weekAlertItem}>血糖有1次餐后偏高，注意控制饮食</Text>
            </View>
          </View>
        )}
      </View>

      <View className={styles.statsRow}>
        {healthTypes.slice(0, 4).map(type => (
          <StatCard
            key={type.key}
            icon={type.icon}
            label={type.title}
            value={
              type.key === 'bloodPressure' ? `${avgSystolic}/${avgDiastolic}` :
              type.key === 'bloodSugar' ? avgBs :
              type.key === 'temperature' ? avgTemp : avgSleep
            }
            unit={
              type.key === 'bloodPressure' ? 'mmHg' :
              type.key === 'bloodSugar' ? 'mmol/L' :
              type.key === 'temperature' ? '°C' : '小时'
            }
            color={type.color}
            bgColor={type.bg}
            onClick={() => handleGotoRecord(type.path)}
          />
        ))}
      </View>

      <View className={styles.recordSection}>
        <SectionHeader
          title="分类录入"
          showAction={false}
        />
        <View className={styles.statsRow}>
          {healthTypes.map(type => (
            <View
              key={type.key}
              style={{
                background: type.bg,
                borderRadius: '16rpx',
                padding: '32rpx 24rpx',
                display: 'flex',
                alignItems: 'center',
                gap: '16rpx',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              onClick={() => handleGotoRecord(type.path)}
            >
              <Text style={{ fontSize: '36rpx' }}>{type.icon}</Text>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: '28rpx', fontWeight: 600, color: type.color, display: 'block' }}>
                  {type.title}
                </Text>
                <Text style={{ fontSize: '22rpx', color: '#86909C' }}>
                  点击录入
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.recordSection}>
        <View
          style={{
            display: 'flex',
            gap: '12rpx',
            overflowX: 'auto',
            padding: '8rpx 0 24rpx',
            marginBottom: '8rpx',
            whiteSpace: 'nowrap'
          }}
        >
          {healthTypes.map(type => (
            <View
              key={type.key}
              onClick={() => handleTypeClick(type.key, type.path)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8rpx',
                padding: '12rpx 24rpx',
                borderRadius: '48rpx',
                background: activeType === type.key ? type.color : '#FFFFFF',
                border: `2rpx solid ${activeType === type.key ? type.color : '#E5E8EB'}`,
                flexShrink: 0,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              <Text style={{ fontSize: '28rpx' }}>{type.icon}</Text>
              <Text
                style={{
                  fontSize: '26rpx',
                  fontWeight: 500,
                  color: activeType === type.key ? '#FFFFFF' : '#4E5969'
                }}
              >
                {type.title}
              </Text>
            </View>
          ))}
        </View>

        {currentRecords.length > 0 ? (
          <View className={styles.recordList}>
            {currentRecords.slice(0, 10).map((record, index) => (
              <View key={index} className={styles.recordItem}>
                <View
                  className={styles.recordIconWrap}
                  style={{ background: currentTypeConfig.bg }}
                >
                  <Text className={styles.recordIcon}>{currentTypeConfig.icon}</Text>
                </View>
                <View className={styles.recordInfo}>
                  <View className={styles.recordMain}>
                    <Text
                      className={styles.recordValue}
                      style={{ color: currentTypeConfig.color }}
                    >
                      {record.value}
                    </Text>
                    <Text className={styles.recordUnit}>{record.unit}</Text>
                  </View>
                  {record.sub && <Text className={styles.recordSub}>{record.sub}</Text>}
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
            icon={currentTypeConfig.icon}
            title={`暂无${currentTypeConfig.title}记录`}
            description={`点击上方"录入${currentTypeConfig.title}"添加第一条记录`}
            actionText={`录入${currentTypeConfig.title}`}
            onAction={() => handleGotoRecord(currentTypeConfig.path)}
          />
        )}
      </View>
    </View>
  );
};

export default HealthPage;
