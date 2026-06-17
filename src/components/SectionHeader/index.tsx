import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  actionPath?: string;
  showAction?: boolean;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText = '查看更多',
  actionPath,
  showAction = true,
  onAction
}) => {
  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionPath) {
      Taro.navigateTo({ url: actionPath });
    }
  };

  return (
    <View className={styles.header}>
      <View className={styles.titleWrapper}>
        <Text className={styles.title}>{title}</Text>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </View>
      {showAction && (
        <Button
          className={classnames(styles.actionBtn, 'button-reset')}
          onClick={handleAction}
        >
          <Text className={styles.actionText}>{actionText}</Text>
          <Text className={styles.arrow}>›</Text>
        </Button>
      )}
    </View>
  );
};

export default SectionHeader;
