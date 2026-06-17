import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import { average } from '@/utils';
import type { HealthStatus } from '@/types';

const weekStart = '2026-06-12';
const weekEnd = '2026-06-18';
const weekDays = [
  { date: '06-12', name: '周五', full: '2026-06-12' },
  { date: '06-13', name: '周六', full: '2026-06-13' },
  { date: '06-14', name: '周日', full: '2026-06-14' },
  { date: '06-15', name: '周一', full: '2026-06-15' },
  { date: '06-16', name: '周二', full: '2026-06-16' },
  { date: '06-17', name: '周三', full: '2026-06-17' },
  { date: '06-18', name: '周四', full: '2026-06-18' }
];

interface AlertItem {
  type: 'danger' | 'warning';
  title: string;
  desc: string;
  date: string;
}

const WeeklyReportPage: React.FC = () => {
  const {
    bloodPressureRecords,
    bloodSugarRecords,
    temperatureRecords,
    sleepRecords,
    waterRecords,
    bowelRecords,
    medicines
  } = useAppStore();

  const weekBP = useMemo(() => {
    return bloodPressureRecords.filter(r => {
      const d = r.date;
      return d >= weekStart && d <= weekEnd;
    });
  }, [bloodPressureRecords]);

  const weekBS = useMemo(() => {
    return bloodSugarRecords.filter(r => {
      const d = r.date;
      return d >= weekStart && d <= weekEnd;
    });
  }, [bloodSugarRecords]);

  const weekTemp = useMemo(() => {
    return temperatureRecords.filter(r => {
      const d = r.date;
      return d >= weekStart && d <= weekEnd;
    });
  }, [temperatureRecords]);

  const weekSleep = useMemo(() => {
    return sleepRecords.filter(r => {
      const d = r.date;
      return d >= weekStart && d <= weekEnd;
    });
  }, [sleepRecords]);

  const weekWater = useMemo(() => {
    return waterRecords.filter(r => {
      const d = r.date;
      return d >= weekStart && d <= weekEnd;
    });
  }, [waterRecords]);

  const weekBowel = useMemo(() => {
    return bowelRecords.filter(r => {
      const d = r.date;
      return d >= weekStart && d <= weekEnd;
    });
  }, [bowelRecords]);

  const stats = useMemo(() => {
    const bpAbnormal = weekBP.filter(r => r.status !== 'normal').length;
    const bsAbnormal = weekBS.filter(r => r.status !== 'normal').length;
    const tempAbnormal = weekTemp.filter(r => r.status !== 'normal').length;
    const totalAbnormal = bpAbnormal + bsAbnormal + tempAbnormal;

    const avgSystolic = Math.round(average(weekBP.map(r => r.systolic)));
    const avgDiastolic = Math.round(average(weekBP.map(r => r.diastolic)));
    const avgBs = average(weekBS.map(r => r.value)).toFixed(1);
    const avgTemp = average(weekTemp.map(r => r.value)).toFixed(1);
    const avgSleep = average(weekSleep.map(r => r.duration)).toFixed(1);

    const waterByDay = weekDays.map(d => {
      return weekWater
        .filter(w => w.date === d.full)
        .reduce((sum, w) => sum + w.amount, 0);
    });
    const avgWater = Math.round(average(waterByDay.filter(v => v > 0)));
    const targetMetDays = waterByDay.filter(v => v >= 1200).length;

    const totalBowel = weekBowel.reduce((sum, b) => sum + b.frequency, 0);
    const normalBowelDays = weekBowel.filter(b => b.consistency === 'normal').length;

    const totalDoses = medicines.reduce((sum, m) => sum + m.times.length * 7, 0);
    const takenDoses = medicines.reduce(
      (sum, m) => sum + m.takenToday.filter(Boolean).length * 5,
      0
    );
    const compliance = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

    return {
      avgSystolic,
      avgDiastolic,
      avgBs,
      avgTemp,
      avgSleep,
      avgWater,
      targetMetDays,
      totalBowel,
      normalBowelDays,
      totalAbnormal,
      bpAbnormal,
      bsAbnormal,
      tempAbnormal,
      compliance
    };
  }, [weekBP, weekBS, weekTemp, weekSleep, weekWater, weekBowel, medicines]);

  const alerts: AlertItem[] = useMemo(() => {
    const list: AlertItem[] = [];

    weekBP.forEach(r => {
      if (r.status === 'danger') {
        list.push({
          type: 'danger',
          title: '血压异常偏高',
          desc: `测量值 ${r.systolic}/${r.diastolic} mmHg${r.note ? '，' + r.note : ''}，建议及时咨询医生。`,
          date: r.date
        });
      } else if (r.status === 'warning') {
        list.push({
          type: 'warning',
          title: '血压偏高',
          desc: `测量值 ${r.systolic}/${r.diastolic} mmHg，建议按时服药，注意休息。`,
          date: r.date
        });
      }
    });

    weekBS.forEach(r => {
      if (r.status === 'danger') {
        list.push({
          type: 'danger',
          title: '血糖异常偏高',
          desc: `测量值 ${r.value} mmol/L（${r.type === 'fasting' ? '空腹' : r.type === 'afterMeal' ? '餐后' : '随机'}）${r.note ? '，' + r.note : ''}。`,
          date: r.date
        });
      } else if (r.status === 'warning') {
        list.push({
          type: 'warning',
          title: '血糖偏高',
          desc: `测量值 ${r.value} mmol/L，注意控制饮食，减少糖分摄入。`,
          date: r.date
        });
      }

    });

    weekTemp.forEach(r => {
      if (r.status === 'warning') {
        list.push({
          type: 'warning',
          title: '体温偏高',
          desc: `测量值 ${r.value}°C${r.note ? '，' + r.note : ''}，建议多喝水并密切观察。`,
          date: r.date
        });
      }
    });

    weekSleep.forEach(r => {
      if (r.quality === 'poor') {
        list.push({
          type: 'warning',
          title: '睡眠质量较差',
          desc: `仅睡眠 ${r.duration} 小时${r.note ? '，' + r.note : ''}，建议睡前避免使用电子产品。`,
          date: r.date
        });
      }
    });

    weekBowel.forEach(r => {
      if (r.frequency === 0) {
        list.push({
          type: 'warning',
          title: '未排便',
          desc: `当日未排便${r.note ? '，' + r.note : ''}，建议增加膳食纤维摄入，多饮水。`,
          date: r.date
        });
      } else if (r.consistency !== 'normal') {
        list.push({
          type: 'warning',
          title: '排便异常',
          desc: `${r.consistency === 'hard' ? '大便偏干' : '大便偏稀'}${r.note ? '，' + r.note : ''}，注意调整饮食。`,
          date: r.date
        });
      }
    });

    medicines.forEach(m => {
      if (m.remainingQuantity <= m.refillThreshold) {
        list.push({
          type: 'warning',
          title: `${m.name} 存量不足`,
          desc: `仅剩 ${m.remainingQuantity} 片，建议尽快复购，避免影响治疗。`,
          date: weekEnd
        });
      }
    });

    return list;
  }, [weekBP, weekBS, weekTemp, weekSleep, weekBowel, medicines]);

  const recommendations = useMemo(() => {
    const list: { icon: string; title: string; desc: string }[] = [];

    if (stats.bpAbnormal > 0) {
      list.push({
        icon: '❤️',
        title: '血压管理建议',
        desc: '每日定时测量血压，坚持按时服药，减少钠盐摄入，避免情绪激动和过度劳累。'
      });
    }

    if (stats.bsAbnormal > 0) {
      list.push({
        icon: '🩸',
        title: '血糖控制建议',
        desc: '严格控制碳水化合物摄入，少食多餐，餐后适当散步30分钟，定期监测血糖变化。'
      });
    }

    list.push({
      icon: '😴',
      title: '睡眠改善建议',
      desc: `本周平均睡眠 ${stats.avgSleep} 小时，建议每晚22点前入睡，睡前1小时不看手机，保持卧室安静舒适。`
    });

    list.push({
      icon: '💧',
      title: '饮水建议',
      desc: `本周有 ${stats.targetMetDays} 天达到饮水目标，建议每日分多次饮水，总量1500-2000ml，避免一次大量饮用。`
    });

    list.push({
      icon: '🚶',
      title: '运动建议',
      desc: '建议每日进行30分钟左右的适度运动，如散步、太极拳等，有助于改善血液循环和睡眠质量。'
    });

    if (alerts.length > 3) {
      list.push({
        icon: '🏥',
        title: '就医建议',
        desc: '本周异常指标较多，建议预约医生进行全面检查，根据医嘱调整用药方案。'
      });
    }

    return list;
  }, [stats, alerts.length]);

  const getTrend = (status: HealthStatus, count: number) => {
    if (count === 0) return { icon: '→', text: '稳定', cls: styles.trendStable };
    if (status === 'danger' || count > 3) return { icon: '↑', text: '需关注', cls: styles.trendUp };
    return { icon: '↗', text: '波动', cls: styles.trendWarning };
  };

  const bpTrend = getTrend(stats.bpAbnormal > 2 ? 'danger' : 'warning', stats.bpAbnormal);
  const bsTrend = getTrend(stats.bsAbnormal > 2 ? 'danger' : 'warning', stats.bsAbnormal);
  const tempTrend = getTrend('normal', stats.tempAbnormal);
  const sleepTrend = parseFloat(stats.avgSleep) >= 7
    ? { icon: '↓', text: '良好', cls: styles.trendDown }
    : parseFloat(stats.avgSleep) < 6
    ? { icon: '↑', text: '偏少', cls: styles.trendUp }
    : { icon: '→', text: '正常', cls: styles.trendStable };
  const waterTrend = stats.targetMetDays >= 5
    ? { icon: '↓', text: '达标', cls: styles.trendDown }
    : stats.targetMetDays >= 3
    ? { icon: '→', text: '一般', cls: styles.trendStable }
    : { icon: '↑', text: '不足', cls: styles.trendUp };
  const bowelTrend = stats.normalBowelDays >= 5
    ? { icon: '↓', text: '良好', cls: styles.trendDown }
    : stats.normalBowelDays >= 3
    ? { icon: '→', text: '一般', cls: styles.trendStable }
    : { icon: '↑', text: '注意', cls: styles.trendUp };

  return (
    <View className={styles.page}>
      <View className={styles.reportHeader}>
        <View className={styles.reportHeaderTop}>
          <View className={styles.reportTitle}>
            <Text className={styles.reportTitleIcon}>📊</Text>
            <Text className={styles.reportTitleText}>健康周报</Text>
          </View>
          <Text className={styles.reportDateRange}>6月12日-6月18日</Text>
        </View>

        <View className={styles.reportSummary}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{stats.avgSystolic}/{stats.avgDiastolic}</Text>
            <Text className={styles.summaryLabel}>平均血压</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{stats.avgBs}</Text>
            <Text className={styles.summaryLabel}>平均血糖</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{stats.avgSleep}h</Text>
            <Text className={styles.summaryLabel}>平均睡眠</Text>
          </View>
        </View>

        <View className={styles.reportCompliance}>
          <View className={styles.complianceHeader}>
            <Text className={styles.complianceLabel}>用药依从率</Text>
            <Text className={styles.complianceValue}>{stats.compliance}%</Text>
          </View>
          <View className={styles.complianceBar}>
            <View
              className={styles.complianceBarFill}
              style={{ width: `${stats.compliance}%` }}
            />
          </View>
        </View>

        <View className={styles.weekDays}>
          {weekDays.map(d => (
            <View
              key={d.full}
              className={classnames(styles.weekDay, {
                [styles.weekDayActive]: d.full === '2026-06-15'
              })}
            >
              <Text className={styles.weekDayDate}>{d.date.split('-')[1]}</Text>
              <Text className={styles.weekDayName}>{d.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleIcon}>📈</Text>
          <Text className={styles.sectionTitleText}>健康数据趋势</Text>
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <View className={styles.statCardHeader}>
              <View
                className={styles.statCardIconWrap}
                style={{ background: 'rgba(245, 63, 63, 0.1)' }}
              >
                <Text className={styles.statCardIcon}>❤️</Text>
              </View>
              <View className={classnames(styles.statTrend, bpTrend.cls)}>
                <Text>{bpTrend.icon}</Text>
                <Text>{bpTrend.text}</Text>
              </View>
            </View>
            <Text className={styles.statCardTitle}>血压</Text>
            <View className={styles.statCardValue}>
              <Text className={styles.statCardNumber}>{stats.avgSystolic}/{stats.avgDiastolic}</Text>
              <Text className={styles.statCardUnit}>mmHg</Text>
            </View>
            <Text className={styles.statCardSub}>异常 {stats.bpAbnormal} 次</Text>
          </View>

          <View className={styles.statCard}>
            <View className={styles.statCardHeader}>
              <View
                className={styles.statCardIconWrap}
                style={{ background: 'rgba(255, 125, 0, 0.1)' }}
              >
                <Text className={styles.statCardIcon}>🩸</Text>
              </View>
              <View className={classnames(styles.statTrend, bsTrend.cls)}>
                <Text>{bsTrend.icon}</Text>
                <Text>{bsTrend.text}</Text>
              </View>
            </View>
            <Text className={styles.statCardTitle}>血糖</Text>
            <View className={styles.statCardValue}>
              <Text className={styles.statCardNumber}>{stats.avgBs}</Text>
              <Text className={styles.statCardUnit}>mmol/L</Text>
            </View>
            <Text className={styles.statCardSub}>异常 {stats.bsAbnormal} 次</Text>
          </View>

          <View className={styles.statCard}>
            <View className={styles.statCardHeader}>
              <View
                className={styles.statCardIconWrap}
                style={{ background: 'rgba(255, 159, 115, 0.15)' }}
              >
                <Text className={styles.statCardIcon}>🌡️</Text>
              </View>
              <View className={classnames(styles.statTrend, tempTrend.cls)}>
                <Text>{tempTrend.icon}</Text>
                <Text>{tempTrend.text}</Text>
              </View>
            </View>
            <Text className={styles.statCardTitle}>体温</Text>
            <View className={styles.statCardValue}>
              <Text className={styles.statCardNumber}>{stats.avgTemp}</Text>
              <Text className={styles.statCardUnit}>°C</Text>
            </View>
            <Text className={styles.statCardSub}>异常 {stats.tempAbnormal} 次</Text>
          </View>

          <View className={styles.statCard}>
            <View className={styles.statCardHeader}>
              <View
                className={styles.statCardIconWrap}
                style={{ background: 'rgba(46, 125, 107, 0.12)' }}
              >
                <Text className={styles.statCardIcon}>😴</Text>
              </View>
              <View className={classnames(styles.statTrend, sleepTrend.cls)}>
                <Text>{sleepTrend.icon}</Text>
                <Text>{sleepTrend.text}</Text>
              </View>
            </View>
            <Text className={styles.statCardTitle}>睡眠</Text>
            <View className={styles.statCardValue}>
              <Text className={styles.statCardNumber}>{stats.avgSleep}</Text>
              <Text className={styles.statCardUnit}>小时</Text>
            </View>
            <Text className={styles.statCardSub}>良好 {weekSleep.filter(s => s.quality === 'good').length} 天</Text>
          </View>

          <View className={styles.statCard}>
            <View className={styles.statCardHeader}>
              <View
                className={styles.statCardIconWrap}
                style={{ background: 'rgba(22, 93, 255, 0.1)' }}
              >
                <Text className={styles.statCardIcon}>💧</Text>
              </View>
              <View className={classnames(styles.statTrend, waterTrend.cls)}>
                <Text>{waterTrend.icon}</Text>
                <Text>{waterTrend.text}</Text>
              </View>
            </View>
            <Text className={styles.statCardTitle}>饮水</Text>
            <View className={styles.statCardValue}>
              <Text className={styles.statCardNumber}>{stats.avgWater}</Text>
              <Text className={styles.statCardUnit}>ml/日</Text>
            </View>
            <Text className={styles.statCardSub}>达标 {stats.targetMetDays}/7 天</Text>
          </View>

          <View className={styles.statCard}>
            <View className={styles.statCardHeader}>
              <View
                className={styles.statCardIconWrap}
                style={{ background: 'rgba(92, 179, 154, 0.12)' }}
              >
                <Text className={styles.statCardIcon}>💩</Text>
              </View>
              <View className={classnames(styles.statTrend, bowelTrend.cls)}>
                <Text>{bowelTrend.icon}</Text>
                <Text>{bowelTrend.text}</Text>
              </View>
            </View>
            <Text className={styles.statCardTitle}>排便</Text>
            <View className={styles.statCardValue}>
              <Text className={styles.statCardNumber}>{stats.totalBowel}</Text>
              <Text className={styles.statCardUnit}>次</Text>
            </View>
            <Text className={styles.statCardSub}>正常 {stats.normalBowelDays}/7 天</Text>
          </View>
        </View>
      </View>

      <View className={classnames(styles.sectionCard, styles.alertsSection)}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleIcon}>⚠️</Text>
          <Text className={styles.sectionTitleText}>异常警告</Text>
          <Text className={styles.alertsCount}>{alerts.length} 项</Text>
        </View>

        {alerts.length > 0 ? (
          <View className={styles.alertsList}>
            {alerts.slice(0, 8).map((alert, idx) => (
              <View
                key={idx}
                className={classnames(styles.alertItem, {
                  [styles.alertItemWarning]: alert.type === 'warning'
                })}
              >
                <Text className={styles.alertIcon}>
                  {alert.type === 'danger' ? '🔴' : '🟠'}
                </Text>
                <View className={styles.alertContent}>
                  <Text className={styles.alertTitle}>{alert.title}</Text>
                  <Text className={styles.alertDesc}>{alert.desc}</Text>
                  <Text className={styles.alertDate}>{alert.date}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className={styles.emptyAlerts}>
            <Text className={styles.emptyAlertsIcon}>✅</Text>
            <Text className={styles.emptyAlertsText}>本周各项指标正常，继续保持！</Text>
          </View>
        )}
      </View>

      <View className={styles.sectionCard}>
        <View className={styles.sectionTitle}>
          <Text className={styles.sectionTitleIcon}>💡</Text>
          <Text className={styles.sectionTitleText}>健康建议</Text>
        </View>

        <View className={styles.adviceList}>
          {recommendations.map((rec, idx) => (
            <View key={idx} className={styles.adviceItem}>
              <View className={styles.adviceIconWrap}>
                <Text className={styles.adviceIcon}>{rec.icon}</Text>
              </View>
              <View className={styles.adviceContent}>
                <Text className={styles.adviceTitle}>{rec.title}</Text>
                <Text className={styles.adviceDesc}>{rec.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default WeeklyReportPage;
