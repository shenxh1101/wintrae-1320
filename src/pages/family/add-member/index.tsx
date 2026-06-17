import React, { useState, useCallback } from 'react';
import { View, Text, Input, Picker, Switch } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import type { FamilyMember } from '@/types';

type RelationshipType = 'spouse' | 'child' | 'sibling' | 'other';

const relationshipOptions: { label: string; value: RelationshipType }[] = [
  { label: '配偶', value: 'spouse' },
  { label: '子女', value: 'child' },
  { label: '兄弟姐妹', value: 'sibling' },
  { label: '其他', value: 'other' }
];

const AddMemberPage: React.FC = () => {
  const { addFamilyMember } = useAppStore();

  const [name, setName] = useState('');
  const [relationshipIndex, setRelationshipIndex] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(true);

  const relationship = relationshipIndex !== null ? relationshipOptions[relationshipIndex] : null;

  const isFormValid = useCallback(() => {
    if (!name.trim()) return false;
    if (relationshipIndex === null) return false;
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) return false;
    return true;
  }, [name, relationshipIndex, phone]);

  const handleNameChange = (e: any) => {
    setName(e.detail.value);
  };

  const handlePhoneChange = (e: any) => {
    setPhone(e.detail.value);
  };

  const handleRelationshipChange = (e: any) => {
    const idx = parseInt(e.detail.value);
    setRelationshipIndex(idx);
  };

  const handleAuthChange = (e: any) => {
    setIsAuthorized(e.detail.value);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (relationshipIndex === null) {
      Taro.showToast({ title: '请选择关系', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      role: relationship!.label,
      phone: phone.trim(),
      relationship: relationship!.value,
      isAuthorized
    };

    addFamilyMember(newMember);

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

  return (
    <View className={styles.page}>
      <View className={styles.headerCard}>
        <Text className={styles.headerIcon}>👨‍👩‍👧</Text>
        <Text className={styles.headerTitle}>添加家属成员</Text>
        <Text className={styles.headerDesc}>添加家属后可共同照护老人，共享健康数据</Text>
      </View>

      <View className={styles.formSection}>
        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>姓名
          </Text>
          <View className={styles.formContent}>
            <Input
              className={styles.formInput}
              placeholder="请输入家属姓名"
              placeholderClass={styles.formInputPlaceholder}
              value={name}
              onInput={handleNameChange}
              maxlength={20}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>关系
          </Text>
          <View className={styles.formContent}>
            <Picker
              mode="selector"
              range={relationshipOptions.map(o => o.label)}
              value={relationshipIndex ?? 0}
              onChange={handleRelationshipChange}
            >
              <View className={styles.pickerWrap}>
                <Text
                  className={classnames(
                    styles.pickerText,
                    relationship ? '' : styles.pickerPlaceholder
                  )}
                >
                  {relationship ? relationship.label : '请选择与老人的关系'}
                </Text>
                <Text className={styles.pickerArrow}>›</Text>
              </View>
            </Picker>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>
            <Text className={styles.formLabelRequired}>*</Text>手机号
          </Text>
          <View className={styles.formContent}>
            <Input
              className={styles.formInput}
              type="number"
              placeholder="请输入11位手机号"
              placeholderClass={styles.formInputPlaceholder}
              value={phone}
              onInput={handlePhoneChange}
              maxlength={11}
            />
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>数据授权</Text>
          <View className={styles.formContent}>
            <View className={styles.switchRow}>
              <View className={styles.switchDesc}>
                <Text className={styles.switchTitle}>授权查看健康数据</Text>
                <Text className={styles.switchHint}>开启后可查看老人的健康记录和报告</Text>
              </View>
              <Switch
                checked={isAuthorized}
                onChange={handleAuthChange}
                color="#2E7D6B"
              />
            </View>
          </View>
        </View>
      </View>

      <View className={styles.authTipCard}>
        <Text className={styles.authTipText}>
          <Text className={styles.authTipStrong}>温馨提示：</Text>
          授权后家属可以查看老人的血压、血糖、用药等健康数据，并接收异常提醒。您可以随时在家属列表中修改授权设置。
        </Text>
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

export default AddMemberPage;
