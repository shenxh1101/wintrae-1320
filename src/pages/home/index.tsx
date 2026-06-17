import React, { useMemo } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import SectionHeader from '@/components/SectionHeader';
import HealthCard from '@/components/HealthCard';
import MedicationCard from '@/components/MedicationCard';
import {
  mockBloodPressureRecords,
  mockBloodSugarRecords,
  mockTemperatureRecords,
  mockSleepRecords,
  mockWaterRecords,
  mockBowelRecords
} from '@/data/health';
import { mockMedicines } from '@/data/medication';
import { getTodayDate, getCurrentTime } from '@/utils';
import type { DailyTodo, HealthStatus } from '@/types';

const HomePage: React.FC = () => {
  const {
    elderName,
    elderAge,
    bloodPressureRecords,
    bloodSugarRecords,
    temperatureRecords,
    medicines,
    toggleMedicineTaken,
    toggleTodo
  } = useAppStore();

  const today = getTodayDate();

  const todayBP = useMemo(() => {
    const all = [...mockBloodPressureRecords, ...bloodPressureRecords];
    return all.find(r => r.date === today) || all[0];
  }, [bloodPressureRecords, today]);

  const todayBS = useMemo(() => {
    const all = [...mockBloodSugarRecords, ...bloodSugarRecords];
    return all.find(r => r.date === today) || all[0];
  }, [bloodSugarRecords, today]);

  const todayTemp = useMemo(() => {
    const all = [...mockTemperatureRecords, ...temperatureRecords];
    return all.find(r => r.date === today) || all[0];
  }, [temperatureRecords, today]);

  const todayWater = useMemo(() => {
    const all = [...mockWaterRecords];
    return all.filter(r => r.date === today).reduce((sum, r) => sum + r.amount, 0);
  }, [today]);

  const todayTodos: DailyTodo[] = useMemo(() => {
    const todos: DailyTodo[] = [];
    const allMeds = [...mockMedicines, ...medicines];

    allMeds.slice(0, 3).forEach(med => {
      med.times.forEach((time, idx) => {
        todos.push({
          id: `med-${med.id}-${idx}`,
          title: `服用 ${med.name} ${med.dosage}`,
          type: 'medicine',
          time,
          isCompleted: med.takenToday[idx] || false,
          relatedId: med.id
        });
      });
    });

    todos.push({
      id: 'todo-1',
      title: '测量血压血糖',
      type: 'health',
      time: '08:00',
      isCompleted: true
    });

    todos.push({
      id: 'todo-2',
      title: '提醒饮水 200ml',
      type: 'health',
      time: '10:00',
      isCompleted: false
    });

    todos.push({
      id: 'todo-3',
      title: '市一院心内科复诊',
      type: 'appointment',
      time: '06-22 09:30',
      isCompleted: false
    });

    return todos.sort((a, b) => a.time.localeCompare(b.time));
  }, [medicines]);

  const completedCount = todayTodos.filter(t => t.isCompleted).length;
  const alertCount = useMemo(() => {
    let count = 0;
    if (todayBP && todayBP.status !== 'normal') count++;
    if (todayBS && todayBS.status !== 'normal') count++;
    if (todayTemp && todayTemp.status !== 'normal') count++;
    const lowStockMeds = [...mockMedicines, ...medicines].filter(
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
      const timeIndex = parseInt(todo.id.split('-').pop() || '0');
      toggleMedicineTaken(todo.relatedId, timeIndex);
    } else {
      toggleTodo(todo.id);
    }
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
            actionText="查看周报"
            actionPath="/pages/health/weekly-report/index"
          />
          <View className="grid grid-cols-2 gap-24">
            <HealthCard
              type="bloodPressure"
              title="血压"
              icon="❤️"
              value={todayBP ? `${todayBP.systolic}/${todayBP.diastolic}` : undefined}
              subValue="mmHg"
              time={todayBP ? `今天 ${todayBP.time}` : undefined}
              status={(todayBP?.status || 'normal') as HealthStatus}
              actionPath="/pages/health/blood-pressure/index"
            />
            <HealthCard
              type="bloodSugar"
              title="血糖"
              icon="🩸"
              value={todayBS ? `${todayBS.value}` : undefined}
              subValue="mmol/L"
              time={todayBS ? `今天 ${todayBS.time}` : undefined}
              status={(todayBS?.status || 'normal') as HealthStatus}
              actionPath="/pages/health/blood-sugar/index"
            />
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader
            title="今日用药"
            actionText="全部药品"
            actionPath="/pages/medication/index"
          />
          <View className="flex flex-col gap-24">
            {[...mockMedicines, ...medicines].slice(0, 2).map(med => (
              <MedicationCard
                key={med.id}
                medicine={med}
                onToggleTime={(id, idx) => toggleMedicineTaken(id, idx)}
              />
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader title="今日待办" showAction={false} />
          <View className={styles.todoCard}>
            <View className={styles.todoHeader}>
              <View className={styles.todoTitle}>
                <Text className={styles.todoTitleIcon}>📋</Text>
                <Text className={styles.todoTitleText}>待办事项</Text>
              </View>
              <Text className={styles.todoProgress}>
                {completedCount}/{todayTodos.length} 已完成
              </Text>
            </View>
            <View className={styles.todoList}>
              {todayTodos.map(todo => (
                <View
                  key={todo.id}
                  className={styles.todoItem}
                  onClick={() => handleToggleTodo(todo)}
                >
                  <View className={classnames(styles.todoCheck, {
                    [styles.todoChecked]: todo.isCompleted
                  })}>
                    <Text className={styles.todoCheckIcon}>✓</Text>
                  </View>
                  <View className={styles.todoContent}>
                    <Text className={classnames(styles.todoItemTitle, {
                      [styles.todoItemTitleDone]: todo.isCompleted
                    })}>
                      {todo.title}
                    </Text>
                    <Text className={styles.todoTime}>⏰ {todo.time}</Text>
                  </View>
                  <View className={classnames(styles.todoTypeTag, getTodoTypeClass(todo.type))}>
                    <Text className={styles.todoTypeText}>{getTodoTypeText(todo.type)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomePage;
