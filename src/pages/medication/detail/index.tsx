import React, { useMemo, useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import { mockMedicines } from '@/data/medication';
import type { Medicine } from '@/types';

const MedicineDetailPage: React.FC = () => {
  const router = useRouter();
  const id = router.params.id;

  const { medicines, toggleMedicineTaken } = useAppStore();
  const [, forceUpdate] = useState({});

  useDidShow(() => {
    forceUpdate({});
  });

  const medicine: Medicine | undefined = useMemo(() => {
    const all = [...mockMedicines, ...medicines];
    return all.find(m => m.id === id);
  }, [id, medicines]);

  const isLowStock = useMemo(() => {
    if (!medicine) return false;
    return medicine.remainingQuantity <= medicine.refillThreshold;
  }, [medicine]);

  const stockPercent = useMemo(() => {
    if (!medicine || medicine.totalQuantity === 0) return 0;
    return Math.round((medicine.remainingQuantity / medicine.totalQuantity) * 100);
  }, [medicine]);

  const refillThresholdPercent = useMemo(() => {
    if (!medicine || medicine.totalQuantity === 0) return 0;
    return Math.round((medicine.refillThreshold / medicine.totalQuantity) * 100);
  }, [medicine]);

  const stockLevel = useMemo(() => {
    if (!medicine) return 'ok';
    if (medicine.remainingQuantity === 0) return 'empty';
    if (isLowStock) return 'low';
    if (stockPercent <= 30) return 'warn';
    return 'ok';
  }, [medicine, isLowStock, stockPercent]);

  const todayProgress = useMemo(() => {
    if (!medicine) return { taken: 0, total: 0, percent: 0 };
    const taken = medicine.takenToday.filter(Boolean).length;
    const total = medicine.times.length;
    const percent = total > 0 ? Math.round((taken / total) * 100) : 0;
    return { taken, total, percent };
  }, [medicine]);

  const allTaken = useMemo(() => {
    if (!medicine) return false;
    return medicine.takenToday.every(Boolean);
  }, [medicine]);

  const handleToggleTime = (index: number) => {
    if (!medicine) return;
    if (medicines.some(m => m.id === medicine.id)) {
      toggleMedicineTaken(medicine.id, index);
    } else {
      Taro.showToast({
        title: medicine.takenToday[index] ? '已取消打卡' : '打卡成功',
        icon: 'success'
      });
      medicine.takenToday[index] = !medicine.takenToday[index];
      if (!medicine.takenToday[index]) {
        medicine.remainingQuantity += 1;
      } else {
        medicine.remainingQuantity = Math.max(0, medicine.remainingQuantity - 1);
      }
      forceUpdate({});
    }
  };

  const handleCheckAll = () => {
    if (!medicine) return;
    if (allTaken) {
      Taro.showToast({
        title: '今日已全部打卡',
        icon: 'none'
      });
      return;
    }
    medicine.times.forEach((_, index) => {
      if (!medicine.takenToday[index]) {
        handleToggleTime(index);
      }
    });
  };

  const handleEdit = () => {
    Taro.showToast({
      title: '编辑功能开发中',
      icon: 'none'
    });
  };

  const handleDelete = () => {
    if (!medicine) return;
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除药品「${medicine.name}」吗？删除后无法恢复。`,
      confirmText: '删除',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  const handleRefillReminder = () => {
    Taro.showToast({
      title: '已提醒复购',
      icon: 'success'
    });
  };

  if (!medicine) {
    return (
      <View className={styles.page}>
        <View className={styles.sectionCard}>
          <Text style={{ fontSize: '28rpx', color: '#86909C' }}>未找到该药品信息</Text>
        </View>
      </View>
    );
  }

  const stockFillClass =
    stockLevel === 'ok' ? styles.stockBarFillOk :
    stockLevel === 'warn' ? styles.stockBarFillWarn :
    stockLevel === 'low' ? styles.stockBarFillLow :
    styles.stockBarFillEmpty;

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <View className={styles.headerDecor} />
        <View className={styles.headerDecor2} />

        <View className={styles.headerContent}>
          <View className={styles.headerTop}>
            <View className={styles.headerMain}>
              <View className={styles.headerIconWrap}>
                <Text className={styles.headerIcon}>💊</Text>
              </View>
              <Text className={styles.medicineName}>{medicine.name}</Text>
              <Text className={styles.medicineDosage}>
                {medicine.dosage} · {medicine.frequency}
              </Text>
            </View>
            {isLowStock && (
              <View className={styles.lowStockBadge}>
                <Text className={styles.lowStockText}>⚠️ 存量不足</Text>
              </View>
            )}
          </View>

          <View className={styles.headerStats}>
            <View className={styles.headerStatItem}>
              <Text className={styles.headerStatValue}>{todayProgress.taken}/{todayProgress.total}</Text>
              <Text className={styles.headerStatLabel}>今日进度</Text>
            </View>
            <View className={styles.headerStatItem}>
              <Text className={styles.headerStatValue}>{stockPercent}%</Text>
              <Text className={styles.headerStatLabel}>剩余药量</Text>
            </View>
            <View className={styles.headerStatItem}>
              <Text className={styles.headerStatValue}>{medicine.refillThreshold}</Text>
              <Text className={styles.headerStatLabel}>复购阈值</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleIcon}>📅</Text>
          <Text className={styles.sectionTitleText}>今日服药</Text>
        </View>

        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>服用进度</Text>
            <Text className={styles.progressValue}>
              {todayProgress.percent}% ({todayProgress.taken}/{todayProgress.total})
            </Text>
          </View>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill}
              style={{ width: `${todayProgress.percent}%` }}
            />
          </View>
        </View>

        <View className={styles.timesList}>
          {medicine.times.map((time, index) => {
            const isTaken = medicine.takenToday[index];
            return (
              <View
                key={index}
                className={styles.timeItem}
                onClick={() => handleToggleTime(index)}
              >
                <View className={classnames(styles.timeIndex, {
                  [styles.timeIndexPending]: !isTaken,
                  [styles.timeIndexDone]: isTaken
                })}>
                  <Text>{index + 1}</Text>
                </View>
                <View className={styles.timeContent}>
                  <Text className={classnames(styles.timeValue, {
                    [styles.timeValueDone]: isTaken
                  })}>
                    {time}
                  </Text>
                  <Text className={classnames(styles.timeStatus, {
                    [styles.timeStatusPending]: !isTaken,
                    [styles.timeStatusDone]: isTaken
                  })}>
                    {isTaken ? '✓ 已服用' : '待服用'}
                  </Text>
                </View>
                <View className={classnames(styles.timeCheck, {
                  [styles.timeCheckPending]: !isTaken,
                  [styles.timeCheckDone]: isTaken
                })}>
                  <Text className={styles.timeCheckIcon}>✓</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleIcon}>📦</Text>
          <Text className={styles.sectionTitleText}>药量管理</Text>
        </View>

        <View className={styles.stockSection}>
          <View className={styles.stockBarWrap}>
            <View className={styles.stockBar}>
              <View
                className={classnames(styles.stockBarFill, stockFillClass)}
                style={{ width: `${stockPercent}%` }}
              />
            </View>
            {medicine.totalQuantity > 0 && (
              <View
                className={styles.refillThresholdLine}
                style={{ left: `${refillThresholdPercent}%` }}
              />
            )}
          </View>

          <View className={styles.stockInfo}>
            <Text className={styles.stockText}>
              剩余 <Text className={styles.stockTextStrong}>{medicine.remainingQuantity}</Text> 片 /
              共 <Text className={styles.stockTextStrong}>{medicine.totalQuantity}</Text> 片
            </Text>
            <Text className={classnames(styles.stockText, {
              [styles.stockTextStrong]: stockLevel === 'low' || stockLevel === 'empty'
            })}
              style={{
                color:
                  stockLevel === 'ok' ? '#00B42A' :
                  stockLevel === 'warn' ? '#FF7D00' :
                  '#F53F3F'
              }}
            >
              {stockLevel === 'ok' ? '库存充足' :
               stockLevel === 'warn' ? '库存偏低' :
               stockLevel === 'low' ? '需要复购' :
               '已用完'}
            </Text>
          </View>

          {isLowStock && (
            <View className={styles.refillAlert}>
              <Text className={styles.refillAlertIcon}>⚠️</Text>
              <Text className={styles.refillAlertText}>
                仅剩 {medicine.remainingQuantity} 片，低于复购阈值（{medicine.refillThreshold}片）
              </Text>
              <Button
                className={classnames(styles.refillAlertBtn, 'button-reset')}
                onClick={handleRefillReminder}
              >
                <Text className={styles.refillAlertBtnText}>提醒复购</Text>
              </Button>
            </View>
          )}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleIcon}>ℹ️</Text>
          <Text className={styles.sectionTitleText}>药品信息</Text>
        </View>

        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>药品名称</Text>
            <Text className={styles.infoValue}>{medicine.name}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>单次剂量</Text>
            <Text className={styles.infoValue}>{medicine.dosage}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>服用频次</Text>
            <Text className={styles.infoValue}>{medicine.frequency}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>每日时段</Text>
            <Text className={styles.infoValue}>{medicine.times.length} 次</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>开始日期</Text>
            <Text className={styles.infoValue}>{medicine.startDate}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>结束日期</Text>
            <Text className={classnames(styles.infoValue, {
              [styles.infoValueEmpty]: !medicine.endDate
            })}>
              {medicine.endDate || '长期服用'}
            </Text>
          </View>
          <View className={classnames(styles.infoItem, styles.infoItemFull)}>
            <Text className={styles.infoLabel}>全部服药时段</Text>
            <Text className={styles.infoValue}>{medicine.times.join(' 、 ')}</Text>
          </View>
          {medicine.instructions && (
            <View className={classnames(styles.infoItem, styles.infoItemFull)}>
              <Text className={styles.infoLabel}>服用说明</Text>
              <View className={styles.instructionsBox}>
                <Text className={styles.instructionsText}>{medicine.instructions}</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View className={styles.actionBar}>
        <Button
          className={classnames(styles.actionBtn, styles.editBtn, 'button-reset')}
          onClick={handleEdit}
        >
          <Text className={styles.editBtnText}>编辑</Text>
        </Button>
        <Button
          className={classnames(styles.checkAllBtn, 'button-reset')}
          onClick={handleCheckAll}
        >
          <Text className={styles.checkAllBtnText}>
            {allTaken ? '✓ 全部已打卡' : '一键全部打卡'}
          </Text>
        </Button>
        <Button
          className={classnames(styles.actionBtn, styles.deleteBtn, 'button-reset')}
          onClick={handleDelete}
        >
          <Text className={styles.deleteBtnText}>删除</Text>
        </Button>
      </View>
    </View>
  );
};

export default MedicineDetailPage;
