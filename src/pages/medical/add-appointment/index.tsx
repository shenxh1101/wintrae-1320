import React, { useState, useCallback } from 'react';
import { View, Text, Input, Picker, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import type { MedicalAppointment } from '@/types';

const typeOptions = [
  { label: '普通门诊', value: 'outpatient' },
  { label: '复诊', value: 'followup' },
  { label: '体检', value: 'checkup' },
  { label: '急诊', value: 'emergency' }
];

const AddAppointmentPage: React.FC = () => {
  const { addAppointment } = useAppStore();

  const [hospital, setHospital] = useState('');
  const [department, setDepartment] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);
  const [items, setItems] = useState('');
  const [notes, setNotes] = useState('');

  const isFormValid = useCallback(() => {
    if (!hospital.trim()) return false;
    if (!department.trim()) return false;
    if (!date) return false;
    if (!time) return false;
    return true;
  }, [hospital, department, date, time]);

  const handleHospitalChange = (e: any) => setHospital(e.detail.value);
  const handleDepartmentChange = (e: any) => setDepartment(e.detail.value);
  const handleDoctorChange = (e: any) => setDoctor(e.detail.value);
  const handleDateChange = (e: any) => setDate(e.detail.value);
  const handleTimeChange = (e: any) => setTime(e.detail.value);
  const handleTypeChange = (e: any) => setTypeIndex(parseInt(e.detail.value));
  const handleItemsChange = (e: any) => setItems(e.detail.value);
  const handleNotesChange = (e: any) => setNotes(e.detail.value);

  const handleSave = () => {
    if (!hospital.trim()) {
      Taro.showToast({ title: '请输入医院名称', icon: 'none' });
      return;
    }
    if (!department.trim()) {
      Taro.showToast({ title: '请输入科室', icon: 'none' });
      return;
    }
    if (!date) {
      Taro.showToast({ title: '请选择日期', icon: 'none' });
      return;
    }
    if (!time) {
      Taro.showToast({ title: '请选择时间', icon: 'none' });
      return;
    }

    const itemList = items
      .split(/[,，、\n]/)
      .map(s => s.trim())
      .filter(Boolean);

    const appointment: Omit<MedicalAppointment, 'id'> = {
      hospital: hospital.trim(),
      department: department.trim(),
      doctor: doctor.trim() || undefined,
      date,
      time,
      type: typeOptions[typeIndex].value as MedicalAppointment['type'],
      status: 'upcoming',
      notes: notes.trim() || undefined,
      items: itemList.length > 0 ? itemList : undefined
    };

    addAppointment(appointment);

    Taro.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          Taro.navigateBack();
        }, 1500);
      }
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <Text className={styles.headerIcon}>🏥</Text>
        <Text className={styles.headerTitle}>添加就医预约</Text>
        <Text className={styles.headerDesc}>记录医院预约信息，就诊前自动提醒</Text>
      </View>

      <View className={styles.formSection}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>医院
          </Text>
          <View className={styles.formContent}>
            <Input
              className={styles.formInput}
              placeholder="请输入医院名称"
              placeholderClass={styles.formInputPlaceholder}
              value={hospital}
              onInput={handleHospitalChange}
              maxlength={50}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>科室
          </Text>
          <View className={styles.formContent}>
            <Input
              className={styles.formInput}
              placeholder="请输入科室名称"
              placeholderClass={styles.formInputPlaceholder}
              value={department}
              onInput={handleDepartmentChange}
              maxlength={30}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>医生</Text>
          <View className={styles.formContent}>
            <Input
              className={styles.formInput}
              placeholder="请输入医生姓名（选填）"
              placeholderClass={styles.formInputPlaceholder}
              value={doctor}
              onInput={handleDoctorChange}
              maxlength={20}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>日期
          </Text>
          <View className={styles.formContent}>
            <Picker
              mode="date"
              start={today}
              value={date}
              onChange={handleDateChange}
            >
              <View className={styles.pickerWrap}>
                <Text
                  className={classnames(
                    styles.pickerText,
                    date ? '' : styles.pickerPlaceholder
                  )}
                >
                  {date || '请选择就诊日期'}
                </Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>时间
          </Text>
          <View className={styles.formContent}>
            <Picker
              mode="time"
              value={time}
              onChange={handleTimeChange}
            >
              <View className={styles.pickerWrap}>
                <Text
                  className={classnames(
                    styles.pickerText,
                    time ? '' : styles.pickerPlaceholder
                  )}
                >
                  {time || '请选择就诊时间'}
                </Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>类型</Text>
          <View className={styles.formContent}>
            <Picker
              mode="selector"
              range={typeOptions.map(o => o.label)}
              value={typeIndex}
              onChange={handleTypeChange}
            >
              <View className={styles.pickerWrap}>
                <Text className={styles.pickerText}>
                  {typeOptions[typeIndex].label}
                </Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
        </View>
      </View>

      <View className={styles.formSection}>
        <View className={styles.formSectionTitle}>
          <Text className={styles.formSectionTitleText}>检查项目</Text>
          <Text className={styles.formSectionHint}>多个项目用逗号或换行分隔</Text>
        </View>
        <Textarea
          className={styles.textarea}
          placeholder="例如：血压测量、心电图检查、血脂化验"
          placeholderClass={styles.formInputPlaceholder}
          value={items}
          onInput={handleItemsChange}
          maxlength={200}
          autoHeight
        />
      </View>

      <View className={styles.formSection}>
        <View className={styles.formSectionTitle}>
          <Text className={styles.formSectionTitleText}>备注</Text>
          <Text className={styles.formSectionHint}>选填</Text>
        </View>
        <Textarea
          className={styles.textarea}
          placeholder="就诊注意事项、需要携带的资料等"
          placeholderClass={styles.formInputPlaceholder}
          value={notes}
          onInput={handleNotesChange}
          maxlength={300}
          autoHeight
        />
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.saveBtn, {
            [styles.saveBtnDisabled]: !isFormValid()
          })}
          onClick={handleSave}
        >
          <Text className={styles.saveBtnText}>保 存</Text>
        </View>
      </View>
    </View>
  );
};

export default AddAppointmentPage;
