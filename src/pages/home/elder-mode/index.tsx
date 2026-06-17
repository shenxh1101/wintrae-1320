import React, { useState, useEffect, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import type { DailyTodo } from '@/types';

const elderName = '王奶奶';

const ElderModePage: React.FC = () => {
  const { todos, familyMembers, toggleTodo, toggleMedicineTaken, medicines } = useAppStore();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekday = weekdays[now.getDay()];
      setCurrentDate(`${year}年${month}月${day}日 ${weekday}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayTodos: DailyTodo[] = useMemo(() => {
    return [...todos].sort((a, b) => a.time.localeCompare(b.time));
  }, [todos]);

  const completedCount = todayTodos.filter(t => t.isCompleted).length;
  const totalCount = todayTodos.length;

  const emergencyContacts = useMemo(() => {
    return familyMembers.filter(m => m.isAuthorized).slice(0, 3);
  }, [familyMembers]);

  const handleExit = () => {
    Taro.showModal({
      title: '退出老人模式',
      content: '确定要退出老人模式，返回普通界面吗？',
      confirmText: '确定退出',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateBack();
        }
      }
    });
  };

  const handleToggleTodo = (todo: DailyTodo) => {
    if (todo.type === 'medicine' && todo.relatedId) {
      const med = medicines.find(m => m.id === todo.relatedId);
      if (med) {
        const timeIdx = med.times.findIndex(t => t === todo.time);
        if (timeIdx >= 0) {
          toggleMedicineTaken(todo.relatedId, timeIdx);
        } else {
          toggleTodo(todo.id);
        }
      } else {
        toggleTodo(todo.id);
      }
    } else {
      toggleTodo(todo.id);
    }

    if (!todo.isCompleted) {
      Taro.showToast({
        title: '已完成 ✓',
        icon: 'success',
        duration: 1500
      });
    }
  };

  const handleSOS = () => {
    const contact = emergencyContacts[0];
    const phone = contact?.phone || '120';
    const name = contact?.name || '紧急联系人';

    Taro.showModal({
      title: '⚠️ 紧急求助',
      content: `确定要拨打${name}的电话 ${phone} 吗？\n同时将通知所有家属您需要帮助。`,
      confirmText: `拨打 ${phone}`,
      confirmColor: '#F53F3F',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: `正在拨打${name}...`,
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  };

  const handleCallFamily = (phone: string, name: string) => {
    Taro.showModal({
      title: '拨打电话',
      content: `确定拨打${name}的电话 ${phone}？`,
      confirmText: '拨打',
      confirmColor: '#2E7D6B',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: `正在拨打${name}...`,
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
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
      <View className={styles.header}>
        <View className={styles.exitBtn} onClick={handleExit}>
          <Text className={styles.exitBtnText}>← 返回</Text>
        </View>

        <View className={styles.greetingTop}>
          <Text className={styles.elderName}>{elderName} 您好</Text>
          <Text className={styles.dateText}>{currentDate}</Text>
          <Text className={styles.timeText}>{currentTime}</Text>
        </View>

        <View className={styles.weatherRow}>
          <Text className={styles.weatherIcon}>☀️</Text>
          <Text className={styles.weatherText}>晴 24°C · 空气良好 · 适宜外出</Text>
        </View>
      </View>

      <View className={styles.todoSection}>
        <View className={styles.todoHeader}>
          <View className={styles.todoTitleWrap}>
            <Text className={styles.todoTitleIcon}>✅</Text>
            <Text className={styles.todoTitle}>今日待办</Text>
          </View>
          <View className={styles.todoProgress}>
            <Text className={styles.todoProgressText}>
              {completedCount} / {totalCount}
            </Text>
          </View>
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
                <View className={styles.todoTimeRow}>
                  <Text className={styles.todoTimeIcon}>⏰</Text>
                  <Text className={styles.todoTime}>{todo.time}</Text>
                </View>
              </View>
              <View className={classnames(styles.todoTypeTag, getTodoTypeClass(todo.type))}>
                <Text className={styles.todoTypeText}>{getTodoTypeText(todo.type)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.sosSection}>
        <View className={styles.sosHeader}>
          <Text className={styles.sosTitle}>紧急求助</Text>
          <Text className={styles.sosSubtitle}>身体不适时请点击下方按钮</Text>
        </View>

        <View className={styles.sosBtnWrap}>
          <View className={styles.sosBtn} onClick={handleSOS}>
            <Text className={styles.sosBtnIcon}>🚨</Text>
            <Text className={styles.sosBtnText}>紧急求助</Text>
            <Text className={styles.sosBtnSub}>点击呼叫家属</Text>
          </View>
        </View>

        <Text className={styles.familyCallTitle}>快速拨打家属电话</Text>

        <View className={styles.familyCallList}>
          {emergencyContacts.map(member => (
            <View
              key={member.id}
              className={styles.familyCallItem}
              onClick={() => handleCallFamily(member.phone, member.name)}
            >
              <View className={styles.familyAvatar}>
                <Text className={styles.familyAvatarText}>
                  {member.name.charAt(0)}
                </Text>
              </View>
              <View className={styles.familyInfo}>
                <Text className={styles.familyName}>{member.name}</Text>
                <Text className={styles.familyRole}>
                  {member.role} · {member.phone}
                </Text>
              </View>
              <View className={styles.familyCallBtn}>
                <Text className={styles.familyCallIcon}>📞</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ElderModePage;
