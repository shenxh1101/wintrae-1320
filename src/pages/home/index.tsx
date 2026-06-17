import React, { useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import SectionHeader from '@/components/SectionHeader';
import HealthCard from '@/components/HealthCard';
import MedicationCard from '@/components/MedicationCard';
import { getTodayDate, getCurrentTime } from '@/utils';
import type { DailyTodo, HealthStatus } from '@/types';

const elderName = '王奶奶';
const elderAge = 78;

const HomePage: React.FC = () => {
  const {
    bloodPressureRecords,
    bloodSugarRecords,
    temperatureRecords,
    waterRecords,
    sleepRecords,
    medicines,
    todos,
    toggleMedicineTaken,
    toggleTodo
  } = useAppStore();

  const today = getTodayDate();

  const todayBP = useMemo(() => {
    return bloodPressureRecords.find(r => r.date === today) || bloodPressureRecords[0];
  }, [bloodPressureRecords, today]);

  const todayBS = useMemo(() => {
    return bloodSugarRecords.find(r => r.date === today) || bloodSugarRecords[0];
  }, [bloodSugarRecords, today]);

  const todayTemp = useMemo(() => {
    return temperatureRecords.find(r => r.date === today) || temperatureRecords[0];
  }, [temperatureRecords, today]);

  const todayWater = useMemo(() => {
    return waterRecords
      .filter(r => r.date === today)
      .reduce((sum, r) => sum + r.amount, 0);
  }, [waterRecords, today]);

  const todayTodos: DailyTodo[] = useMemo(() => {
    return [...todos].sort((a, b) => a.time.localeCompare(b.time));
  }, [todos]);

  const completedCount = todayTodos.filter(t => t.isCompleted).length;

  const alertCount = useMemo(() => {
    let count = 0;
    if (todayBP && todayBP.status !== 'normal') count++;
    if (todayBS && todayBS.status !== 'normal') count++;
    if (todayTemp && todayTemp.status !== 'normal') count++;
    const lowStockMeds = medicines.filter(
      m => m.remainingQuantity <= m.refillThreshold
    );
    count += lowStockMeds.length;
    return count;
  }, [todayBP, todayBS, todayTemp, medicines]);

  const handleSOS = () => {
    Taro.showModal({
      title: '紧急求助',
      content: '确定要向紧急联系人和家属发送求助信息吗？',
      confirmText: '发送求助',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '求助信息已发送',
            icon: 'success'
          });
        }
      }
    });
  };

  const handleElderMode = () => {
    Taro.navigateTo({ url: '/pages/home/elder-mode/index' });
  };

  const handleQuickAction = (path: string) => {
    Taro.navigateTo({ url: path });
  };

  const handleToggleTodo = (todo: DailyTodo) => {
    if (todo.type === 'medicine' && todo.relatedId) {
      const med = medicines.find(m => m.id === todo.relatedId);
      if (med) {
        const timeIdx = med.times.findIndex(t => t === todo.time);
        if (timeIdx >= 0) {
          toggleMedicineTaken(todo.relatedId, timeIdx);
          return;
        }
      }
    }
    toggleTodo(todo.id);
  };

  const getTodoTypeClass = (type: string) => {
    const map: Record<string, string> = {
      medicine: styles.typeMedicine,
      health: styles.typeHealth,
      appointment: styles.typeAppointment
    };
    return map[type] || '';
  };

  const getTodoTypeText = (type: string) => {
    const map: Record<string, string> = {
      medicine: '用药',
      health: '健康',
      appointment: '就医'
    };
    return map[type] || '';
  };

  const todayMedicines = useMemo(() => medicines.slice(0, 2), [medicines]);

  return (
    <View className={styles.page}>
      <View className={styles.headerBg}>
        <View className={styles.headerDecor} />
        <View className={styles.headerDecor2} />

        <View className={styles.greetingRow}>
          <View className={styles.elderInfo}>
            <Text className={styles.elderName}>{elderName} 您好</Text>
            <Text className={styles.elderSub}>{elderAge}岁 · 今天是 {today}</Text>
          </View>
          <Button
            className={classnames(styles.elderModeBtn, 'button-reset')}
            onClick={handleElderMode}
          >
            <Text className={styles.elderModeBtnText}>👴 老人模式</Text>
          </Button>
        </View>

        <View className={styles.overviewRow}>
          <View className={styles.overviewCard}>
            <Text className={styles.overviewLabel}>今日待办</Text>
            <Text className={styles.overviewValue}>
              {completedCount}/{todayTodos.length}
            </Text>
            <Text className={styles.overviewSub}>项已完成</Text>
          </View>
          <View className={styles.overviewCard}>
            <Text className={styles.overviewLabel}>饮水进度</Text>
            <Text className={styles.overviewValue}>{todayWater}ml</Text>
            <Text className={styles.overviewSub}>目标 1500ml</Text>
          </View>
          <View className={styles.overviewCard}>
            <Text className={styles.overviewLabel}>健康提醒</Text>
            <Text className={classnames(styles.overviewValue, alertCount > 0 ? styles.overviewAlert : '')}>
              {alertCount}
            </Text>
            <Text className={styles.overviewSub}>项需关注</Text>
          </View>
        </View>
      </View>

      <View className={styles.contentArea}>
        <View className={styles.sosCard} onClick={handleSOS}>
          <View className={styles.sosInfo}>
            <View className={styles.sosTitle}>
              <Text className={styles.sosIcon}>🚨</Text>
              <Text className={styles.sosTitleText}>一键紧急求助</Text>
            </View>
            <Text className={styles.sosDesc}>
              身体不适时点击呼叫，将自动通知所有紧急联系人和家属
            </Text>
          </View>
          <Button className={classnames(styles.sosBtn, 'button-reset')}>
            <Text className={styles.sosBtnText}>求助</Text>
          </Button>
        </View>

        <View className={styles.section}>
          <SectionHeader title="快速录入" showAction={false} />
          <View className={styles.quickGrid}>
            <View
              className={styles.quickItem}
              onClick={() => handleQuickAction('/pages/health/blood-pressure/index')}
            >
              <View className={styles.quickIconWrap} style={{ background: 'rgba(245, 63, 63, 0.1)' }}>
                <Text className={styles.quickIcon}>❤️</Text>
              </View>
              <Text className={styles.quickLabel}>血压</Text>
            </View>
            <View
              className={styles.quickItem}
              onClick={() => handleQuickAction('/pages/health/blood-sugar/index')}
            >
              <View className={styles.quickIconWrap} style={{ background: 'rgba(255, 125, 0, 0.1)' }}>
                <Text className={styles.quickIcon}>🩸</Text>
              </View>
              <Text className={styles.quickLabel}>血糖</Text>
            </View>
            <View
              className={styles.quickItem}
              onClick={() => handleQuickAction('/pages/health/temperature/index')}
            >
              <View className={styles.quickIconWrap} style={{ background: 'rgba(255, 159, 115, 0.15)' }}>
                <Text className={styles.quickIcon}>🌡️</Text>
              </View>
              <Text className={styles.quickLabel}>体温</Text>
            </View>
            <View
              className={styles.quickItem}
              onClick={() => handleQuickAction('/pages/health/sleep/index')}
            >
              <View className={styles.quickIconWrap} style={{ background: 'rgba(46, 125, 107, 0.12)' }}>
                <Text className={styles.quickIcon}>😴</Text>
              </View>
              <Text className={styles.quickLabel}>睡眠</Text>
            </View>
            <View
              className={styles.quickItem}
              onClick={() => handleQuickAction('/pages/health/water/index')}
            >
              <View className={styles.quickIconWrap} style={{ background: 'rgba(22, 93, 255, 0.1)' }}>
                <Text className={styles.quickIcon}>💧</Text>
              </View>
              <Text className={styles.quickLabel}>饮水</Text>
            </View>
            <View
              className={styles.quickItem}
              onClick={() => handleQuickAction('/pages/health/bowel/index')}
            >
              <View className={styles.quickIconWrap} style={{ background: 'rgba(92, 179, 154, 0.12)' }}>
                <Text className={styles.quickIcon}>💩</Text>
              </View>
              <Text className={styles.quickLabel}>排便</Text>
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader
            title="今日健康"
            actionText="查看更多"
            onAction={() => Taro.switchTab({ url: '/pages/health/index' })}
          />
          <View className={styles.healthCards}>
            {todayBP && (
              <HealthCard
                type="bloodPressure"
                value={`${todayBP.systolic}/${todayBP.diastolic}`}
                unit="mmHg"
                status={todayBP.status as HealthStatus}
                label="血压"
                icon="❤️"
              />
            )}
            {todayBS && (
              <HealthCard
                type="bloodSugar"
                value={todayBS.value.toString()}
                unit="mmol/L"
                status={todayBS.status as HealthStatus}
                label="血糖"
                icon="🩸"
              />
            )}
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader
            title="今日用药"
            actionText="全部药品"
            onAction={() => Taro.switchTab({ url: '/pages/medication/index' })}
          />
          <View className={styles.medicationList}>
            {todayMedicines.map(med => (
              <MedicationCard
                key={med.id}
                medicine={med}
                onToggleTime={(id, idx) => toggleMedicineTaken(id, idx)}
              />
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader
            title="今日待办"
            subtitle={`${completedCount}/${todayTodos.length} 已完成`}
            showAction={false}
          />
          <View className={styles.todoList}>
            {todayTodos.map(todo => (
              <View
                key={todo.id}
                className={classnames(styles.todoItem, {
                  [styles.todoCompleted]: todo.isCompleted
                })}
                onClick={() => handleToggleTodo(todo)}
              >
                <View className={styles.todoCheckbox}>
                  {todo.isCompleted ? (
                    <Text className={styles.todoCheckIcon}>✓</Text>
                  ) : null}
                </View>
                <View className={styles.todoContent}>
                  <Text className={styles.todoTitle}>{todo.title}</Text>
                  <View className={styles.todoMeta}>
                    <Text className={styles.todoTime}>⏰ {todo.time}</Text>
                    <View className={classnames(styles.todoTypeTag, getTodoTypeClass(todo.type))}>
                      <Text className={styles.todoTypeText}>{getTodoTypeText(todo.type)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
