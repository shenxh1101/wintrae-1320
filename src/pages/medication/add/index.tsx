import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Input, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import { generateId } from '@/utils';

interface FormState {
  name: string;
  dosage: string;
  frequency: '每日1次' | '每日2次' | '每日3次';
  times: string[];
  totalQuantity: string;
  remainingQuantity: string;
  refillThreshold: string;
  instructions: string;
}

const defaultTimesMap: Record<string, string[]> = {
  '每日1次': ['08:00'],
  '每日2次': ['08:00', '20:00'],
  '每日3次': ['08:00', '12:00', '20:00']
};

const AddMedicinePage: React.FC = () => {
  const { addMedicine } = useAppStore();

  const [form, setForm] = useState<FormState>({
    name: '',
    dosage: '',
    frequency: '每日1次',
    times: ['08:00'],
    totalQuantity: '',
    remainingQuantity: '',
    refillThreshold: '',
    instructions: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    const defaultTimes = defaultTimesMap[form.frequency];
    if (form.times.length === 0) {
      setForm(prev => ({ ...prev, times: defaultTimes }));
    }
  }, [form.frequency]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleFrequencyChange = (freq: FormState['frequency']) => {
    updateField('frequency', freq);
    setForm(prev => ({
      ...prev,
      frequency: freq,
      times: defaultTimesMap[freq]
    }));
  };

  const handleTimeChange = (index: number, value: string) => {
    setForm(prev => {
      const nextTimes = [...prev.times];
      nextTimes[index] = value;
      return { ...prev, times: nextTimes };
    });
  };

  const handleAddTime = () => {
    if (form.times.length >= 6) {
      Taro.showToast({
        title: '最多设置6个时间段',
        icon: 'none'
      });
      return;
    }
    setForm(prev => ({
      ...prev,
      times: [...prev.times, '']
    }));
  };

  const handleRemoveTime = (index: number) => {
    if (form.times.length <= 1) {
      Taro.showToast({
        title: '至少保留1个时间段',
        icon: 'none'
      });
      return;
    }
    setForm(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) {
      newErrors.name = '请输入药品名称';
    }

    if (!form.dosage.trim()) {
      newErrors.dosage = '请输入药品剂量';
    }

    const validTimes = form.times.filter(t => t.trim());
    if (validTimes.length === 0) {
      Taro.showToast({
        title: '请至少设置一个服药时间',
        icon: 'none'
      });
      return false;
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const invalidTime = form.times.find(t => t.trim() && !timeRegex.test(t.trim()));
    if (invalidTime) {
      Taro.showToast({
        title: '时间格式应为 HH:MM',
        icon: 'none'
      });
      return false;
    }

    const totalQty = parseInt(form.totalQuantity);
    if (form.totalQuantity && (isNaN(totalQty) || totalQty <= 0)) {
      newErrors.totalQuantity = '请输入有效的数量';
    }

    const remainQty = parseInt(form.remainingQuantity);
    if (form.remainingQuantity && (isNaN(remainQty) || remainQty < 0)) {
      newErrors.remainingQuantity = '请输入有效的数量';
    }

    if (totalQty && remainQty && remainQty > totalQty) {
      newErrors.remainingQuantity = '余量不能大于总量';
    }

    const threshold = parseInt(form.refillThreshold);
    if (form.refillThreshold && (isNaN(threshold) || threshold < 0)) {
      newErrors.refillThreshold = '请输入有效的阈值';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const validTimes = form.times.filter(t => t.trim());
    const totalQty = parseInt(form.totalQuantity) || 0;
    const remainQty = parseInt(form.remainingQuantity) || totalQty;
    const threshold = parseInt(form.refillThreshold) || 10;

    addMedicine({
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency,
      times: validTimes,
      totalQuantity: totalQty,
      remainingQuantity: remainQty,
      refillThreshold: threshold,
      startDate: new Date().toISOString().split('T')[0],
      instructions: form.instructions.trim() || undefined
    });

    Taro.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  };

  const handleCancel = () => {
    Taro.showModal({
      title: '确认取消',
      content: '取消后填写的内容将丢失，是否继续？',
      confirmText: '继续取消',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          Taro.navigateBack();
        }
      }
    });
  };

  const preview = useMemo(() => {
    const validTimes = form.times.filter(t => t.trim());
    return {
      name: form.name.trim() || '药品名称',
      dosage: form.dosage.trim()
        ? `${form.dosage.trim()} · ${form.frequency}`
        : `请设置剂量 · ${form.frequency}`,
      times: validTimes
    };
  }, [form]);

  return (
    <View className={styles.page}>
      <View className={styles.previewCard}>
        <View className={styles.previewTitle}>
          <Text className={styles.previewIcon}>👁️</Text>
          <Text>预览</Text>
        </View>
        <Text className={classnames(styles.previewName, {
          [styles.previewNameEmpty]: !form.name.trim()
        })}>
          {preview.name}
        </Text>
        <Text className={styles.previewDosage}>{preview.dosage}</Text>
        {preview.times.length > 0 ? (
          <View className={styles.previewTimes}>
            {preview.times.map((t, i) => (
              <Text key={i} className={styles.previewTimeTag}>{t}</Text>
            ))}
          </View>
        ) : (
          <Text className={styles.previewEmpty}>请设置服药时间</Text>
        )}
      </View>

      <View className={styles.formCard}>
        <View className={styles.formCardTitle}>
          <Text className={styles.formCardIcon}>📋</Text>
          <Text>基本信息</Text>
        </View>

        <View className={styles.formGroup}>
          <View className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>
            <Text>药品名称</Text>
          </View>
          <Input
            className={classnames(styles.formInput, {
              [styles.formInputError]: errors.name
            })}
            placeholder="请输入药品名称，如：氨氯地平片"
            value={form.name}
            onInput={(e) => updateField('name', e.detail.value)}
            maxlength={30}
          />
          {errors.name && <Text className={styles.errorText}>{errors.name}</Text>}
        </View>

        <View className={styles.formGroup}>
          <View className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>
            <Text>药品剂量</Text>
          </View>
          <Input
            className={classnames(styles.formInput, {
              [styles.formInputError]: errors.dosage
            })}
            placeholder="请输入剂量，如：5mg、0.5g、1片"
            value={form.dosage}
            onInput={(e) => updateField('dosage', e.detail.value)}
            maxlength={20}
          />
          {errors.dosage && <Text className={styles.errorText}>{errors.dosage}</Text>}
        </View>

        <View className={styles.formGroup}>
          <View className={styles.formLabel}>
            <Text>服用频次</Text>
          </View>
          <View className={styles.frequencyOptions}>
            {(['每日1次', '每日2次', '每日3次'] as const).map(freq => (
              <View
                key={freq}
                className={classnames(styles.frequencyOption, {
                  [styles.frequencyOptionActive]: form.frequency === freq
                })}
                onClick={() => handleFrequencyChange(freq)}
              >
                <Text>{freq}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formCardTitle}>
          <Text className={styles.formCardIcon}>⏰</Text>
          <Text>服药时段</Text>
        </View>

        <View className={styles.timesSection}>
          <View className={styles.timesHeader}>
            <Text className={styles.timesLabel}>已设置 {form.times.filter(t => t.trim()).length} 个时间点</Text>
            <Button
              className={classnames(styles.addTimeBtn, 'button-reset')}
              onClick={handleAddTime}
            >
              <Text className={styles.addTimeBtnText}>+ 添加时间</Text>
            </Button>
          </View>

          <View className={styles.timesList}>
            {form.times.map((time, index) => (
              <View key={index} className={styles.timeItem}>
                <Text className={styles.timeItemIndex}>{index + 1}</Text>
                <Input
                  className={styles.timeItemInput}
                  placeholder="HH:MM"
                  value={time}
                  onInput={(e) => handleTimeChange(index, e.detail.value)}
                  maxlength={5}
                />
                <View
                  className={styles.timeItemDelete}
                  onClick={() => handleRemoveTime(index)}
                >
                  <Text className={styles.timeItemDeleteIcon}>✕</Text>
                </View>
              </View>
            ))}
          </View>

          <Text className={styles.timesHint}>
            点击时间框可手动输入，格式示例：08:00 / 12:00 / 20:00
          </Text>
        </View>
      </View>

      <View className={styles.formCard}>
        <View className={styles.formCardTitle}>
          <Text className={styles.formCardIcon}>📊</Text>
          <Text>药量设置</Text>
        </View>

        <View className={styles.formGroup}>
          <View className={styles.quantityRow}>
            <View className={styles.quantityItem}>
              <Text className={styles.quantityLabel}>总量</Text>
              <Input
                className={classnames(styles.quantityInput, {
                  [styles.formInputError]: errors.totalQuantity
                })}
                type="number"
                placeholder="片/粒"
                value={form.totalQuantity}
                onInput={(e) => updateField('totalQuantity', e.detail.value)}
              />
            </View>
            <View className={styles.quantityItem}>
              <Text className={styles.quantityLabel}>余量</Text>
              <Input
                className={classnames(styles.quantityInput, {
                  [styles.formInputError]: errors.remainingQuantity
                })}
                type="number"
                placeholder="默认=总量"
                value={form.remainingQuantity}
                onInput={(e) => updateField('remainingQuantity', e.detail.value)}
              />
            </View>
            <View className={styles.quantityItem}>
              <Text className={styles.quantityLabel}>复购阈值</Text>
              <Input
                className={classnames(styles.quantityInput, {
                  [styles.formInputError]: errors.refillThreshold
                })}
                type="number"
                placeholder="默认10"
                value={form.refillThreshold}
                onInput={(e) => updateField('refillThreshold', e.detail.value)}
              />
            </View>
          </View>
          {(errors.totalQuantity || errors.remainingQuantity || errors.refillThreshold) && (
            <Text className={styles.errorText}>
              {errors.totalQuantity || errors.remainingQuantity || errors.refillThreshold}
            </Text>
          )}
        </View>

        <View className={styles.formGroup}>
          <View className={styles.formLabel}>
            <Text>说明备注</Text>
          </View>
          <Textarea
            className={styles.textarea}
            placeholder="请输入服用说明、注意事项等（选填）"
            value={form.instructions}
            onInput={(e) => updateField('instructions', e.detail.value)}
            maxlength={200}
          />
        </View>
      </View>

      <View className={styles.footerBar}>
        <Button
          className={classnames(styles.cancelBtn, 'button-reset')}
          onClick={handleCancel}
        >
          <Text className={styles.cancelBtnText}>取消</Text>
        </Button>
        <Button
          className={classnames(styles.submitBtn, 'button-reset')}
          onClick={handleSubmit}
        >
          <Text className={styles.submitBtnText}>保存药品</Text>
        </Button>
      </View>
    </View>
  );
};

export default AddMedicinePage;
