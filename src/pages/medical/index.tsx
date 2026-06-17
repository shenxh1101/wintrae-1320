import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import SectionHeader from '@/components/SectionHeader';
import MedicalCard from '@/components/MedicalCard';
import EmptyState from '@/components/EmptyState';
import {
  mockAppointments,
  mockCheckupRecords,
  mockDoctorAdvices
} from '@/data/medical';
import type { MedicalAppointment, CheckupRecord } from '@/types';

type TabType = 'appointments' | 'checkups' | 'advices';

const MedicalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('appointments');

  const appointments = mockAppointments;
  const checkupRecords = mockCheckupRecords;
  const doctorAdvices = mockDoctorAdvices;

  const upcomingAppointments = useMemo(
    () => appointments.filter(a => a.status === 'upcoming'),
    [appointments]
  );

  const nextAppointment = upcomingAppointments[0];

  const handleAdd = () => {
    if (activeTab === 'appointments') {
      Taro.navigateTo({ url: '/pages/medical/appointment/index' });
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  const handleCheckupDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/medical/checkup/index?id=${id}` });
  };

  const getCheckupStats = (record: CheckupRecord) => {
    const normal = record.items.filter(i => i.status === 'normal').length;
    const warning = record.items.filter(i => i.status === 'warning').length;
    const danger = record.items.filter(i => i.status === 'danger').length;
    return { normal, warning, danger };
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabItem, {
            [styles.tabItemActive]: activeTab === 'appointments'
          })}
          style={{ position: 'relative' }}
          onClick={() => setActiveTab('appointments')}
        >
          <Text className={styles.tabText}>预约</Text>
          {upcomingAppointments.length > 0 && (
            <View className={styles.upcomingBadge}>
              <Text className={styles.upcomingBadgeText}>{upcomingAppointments.length}</Text>
            </View>
          )}
        </View>
        <View
          className={classnames(styles.tabItem, {
            [styles.tabItemActive]: activeTab === 'checkups'
          })}
          onClick={() => setActiveTab('checkups')}
        >
          <Text className={styles.tabText}>检查单</Text>
        </View>
        <View
          className={classnames(styles.tabItem, {
            [styles.tabItemActive]: activeTab === 'advices'
          })}
          onClick={() => setActiveTab('advices')}
        >
          <Text className={styles.tabText}>医嘱</Text>
        </View>
      </View>

      {activeTab === 'appointments' && nextAppointment && (
        <View className={styles.nextAppointment}>
          <View className={styles.nextHeader}>
            <Text className={styles.nextIcon}>⏰</Text>
            <Text className={styles.nextTitle}>最近就诊</Text>
          </View>
          <Text className={styles.nextHospital}>{nextAppointment.hospital}</Text>
          <Text className={styles.nextDept}>
            {nextAppointment.department}
            {nextAppointment.doctor && ` · ${nextAppointment.doctor}`}
          </Text>
          <View className={styles.nextInfoRow}>
            <View className={styles.nextInfoItem}>
              <Text className={styles.nextInfoIcon}>📅</Text>
              <Text className={styles.nextInfoText}>{nextAppointment.date}</Text>
            </View>
            <View className={styles.nextInfoItem}>
              <Text className={styles.nextInfoIcon}>🕐</Text>
              <Text className={styles.nextInfoText}>{nextAppointment.time}</Text>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'appointments' && (
        <View className={styles.listSection}>
          <SectionHeader
            title="就医预约"
            subtitle={`${upcomingAppointments.length}项待就诊`}
            showAction={false}
          />
          {appointments.length > 0 ? (
            <View className="flex flex-col gap-24">
              {appointments.map(apt => (
                <MedicalCard key={apt.id} appointment={apt} />
              ))}
            </View>
          ) : (
            <View className={styles.emptyWrap}>
              <EmptyState
                icon="🏥"
                title="暂无就医预约"
                description="添加医院预约信息，提前提醒就诊"
                actionText="添加预约"
                onAction={handleAdd}
              />
            </View>
          )}
        </View>
      )}

      {activeTab === 'checkups' && (
        <View className={styles.listSection}>
          <SectionHeader
            title="检查报告"
            subtitle={`${checkupRecords.length}份记录`}
            showAction={false}
          />
          {checkupRecords.length > 0 ? (
            checkupRecords.map(record => {
              const stats = getCheckupStats(record);
              return (
                <View
                  key={record.id}
                  className={styles.checkupCard}
                  onClick={() => handleCheckupDetail(record.id)}
                >
                  <View className={styles.checkupHeader}>
                    <View className={styles.checkupInfo}>
                      <Text className={styles.checkupTitle}>{record.title}</Text>
                      <Text className={styles.checkupHospital}>{record.hospital}</Text>
                      <Text className={styles.checkupDate}>检查日期：{record.date}</Text>
                    </View>
                    <Text className={styles.checkupArrow}>›</Text>
                  </View>
                  <View className={styles.checkupStats}>
                    <View className={styles.checkupStatItem}>
                      <Text className={classnames(styles.checkupStatValue, styles.statNormal)}>
                        {stats.normal}
                      </Text>
                      <Text className={styles.checkupStatLabel}>正常</Text>
                    </View>
                    <View className={styles.checkupStatItem}>
                      <Text className={classnames(styles.checkupStatValue, styles.statWarning)}>
                        {stats.warning}
                      </Text>
                      <Text className={styles.checkupStatLabel}>偏高</Text>
                    </View>
                    <View className={styles.checkupStatItem}>
                      <Text className={classnames(styles.checkupStatValue, styles.statDanger)}>
                        {stats.danger}
                      </Text>
                      <Text className={styles.checkupStatLabel}>异常</Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View className={styles.emptyWrap}>
              <EmptyState
                icon="📋"
                title="暂无检查报告"
                description="录入体检报告和化验单，方便随时查看"
              />
            </View>
          )}
        </View>
      )}

      {activeTab === 'advices' && (
        <View className={styles.listSection}>
          <SectionHeader
            title="医生叮嘱"
            subtitle={`${doctorAdvices.length}条记录`}
            showAction={false}
          />
          {doctorAdvices.length > 0 ? (
            doctorAdvices.map(advice => (
              <View key={advice.id} className={styles.adviceCard}>
                <View className={styles.adviceHeader}>
                  <Text className={styles.adviceIcon}>👨‍⚕️</Text>
                  <Text className={styles.adviceDoctor}>
                    {advice.doctor}
                    {advice.hospital && ` · ${advice.hospital.split('').slice(0, 6).join('')}`}
                  </Text>
                  <Text className={styles.adviceDate}>{advice.date}</Text>
                </View>
                <Text className={styles.adviceContent}>{advice.content}</Text>
              </View>
            ))
          ) : (
            <View className={styles.emptyWrap}>
              <EmptyState
                icon="📝"
                title="暂无医嘱记录"
                description="记录医生的叮嘱和注意事项"
              />
            </View>
          )}
        </View>
      )}

      <View className={styles.addFab} onClick={handleAdd}>
        <Text className={styles.addFabText}>+</Text>
      </View>
    </View>
  );
};

export default MedicalPage;
