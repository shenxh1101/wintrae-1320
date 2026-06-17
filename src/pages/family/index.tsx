import React, { useState, useMemo } from 'react';
import { View, Text, Button, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import { mockFamilyMembers, mockCareMessages, mockCareTasks } from '@/data/family';
import { formatRelativeTime } from '@/utils';

type TabType = 'members' | 'messages' | 'tasks';

const FamilyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [messageInput, setMessageInput] = useState('');

  const { familyMembers, careMessages, careTasks, sendCareMessage, completeTask } = useAppStore();

  const allMembers = useMemo(
    () => [...mockFamilyMembers, ...familyMembers],
    [familyMembers]
  );
  const allMessages = useMemo(
    () => [...mockCareMessages, ...careMessages],
    [careMessages]
  );
  const allTasks = useMemo(
    () => [...mockCareTasks, ...careTasks],
    [careTasks]
  );

  const unreadCount = allMessages.filter(m => !m.isRead).length;
  const pendingTasks = allTasks.filter(t => t.status === 'pending').length;
  const authorizedMembers = allMembers.filter(m => m.isAuthorized).length;

  const handleAddMember = () => {
    Taro.navigateTo({ url: '/pages/family/add-member/index' });
  };

  const handleCall = (phone: string, name: string) => {
    Taro.showModal({
      title: '拨打电话',
      content: `确定拨打${name}的电话 ${phone}？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: `正在拨打${name}...`, icon: 'none' });
        }
      }
    });
  };

  const handleToggleAuth = (memberId: string, name: string) => {
    Taro.showToast({ title: `已更新${name}的授权`, icon: 'none' });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      Taro.showToast({ title: '请输入留言内容', icon: 'none' });
      return;
    }
    sendCareMessage(messageInput.trim(), '照护者', '主要照护人');
    setMessageInput('');
    Taro.showToast({ title: '留言已发送', icon: 'success' });
  };

  const handleCompleteTask = (taskId: string, assignedName: string) => {
    Taro.showModal({
      title: '确认完成',
      content: '确定标记此任务为已完成吗？',
      success: (res) => {
        if (res.confirm) {
          completeTask(taskId, '照护者');
          Taro.showToast({ title: '任务已完成', icon: 'success' });
        }
      }
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.tabs}>
        <View
          className={classnames(styles.tabItem, {
            [styles.tabItemActive]: activeTab === 'members'
          })}
          onClick={() => setActiveTab('members')}
        >
          <Text className={styles.tabText}>家属成员</Text>
        </View>
        <View
          className={classnames(styles.tabItem, {
            [styles.tabItemActive]: activeTab === 'messages'
          })}
          style={{ position: 'relative' }}
          onClick={() => setActiveTab('messages')}
        >
          <Text className={styles.tabText}>留言交接</Text>
          {unreadCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: '4rpx',
                right: '16%',
                minWidth: '32rpx',
                height: '32rpx',
                padding: '0 8rpx',
                background: '#F53F3F',
                borderRadius: '999rpx',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ fontSize: '20rpx', color: '#FFFFFF', fontWeight: 700 }}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View
          className={classnames(styles.tabItem, {
            [styles.tabItemActive]: activeTab === 'tasks'
          })}
          style={{ position: 'relative' }}
          onClick={() => setActiveTab('tasks')}
        >
          <Text className={styles.tabText}>照护任务</Text>
          {pendingTasks > 0 && (
            <View
              style={{
                position: 'absolute',
                top: '4rpx',
                right: '16%',
                minWidth: '32rpx',
                height: '32rpx',
                padding: '0 8rpx',
                background: '#FF7D00',
                borderRadius: '999rpx',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ fontSize: '20rpx', color: '#FFFFFF', fontWeight: 700 }}>{pendingTasks}</Text>
            </View>
          )}
        </View>
      </View>

      <View className={styles.summaryCard}>
        <View className={styles.summaryRow}>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{authorizedMembers}</Text>
            <Text className={styles.summaryLabel}>已授权家属</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{allMessages.length}</Text>
            <Text className={styles.summaryLabel}>交接留言</Text>
          </View>
          <View className={styles.summaryItem}>
            <Text className={styles.summaryValue}>{pendingTasks}</Text>
            <Text className={styles.summaryLabel}>待办任务</Text>
          </View>
        </View>
      </View>

      {activeTab === 'members' && (
        <>
          <SectionHeader
            title="家属成员"
            subtitle={`${allMembers.length}位家属`}
            showAction={false}
          />

          <Button
            className={classnames(styles.addMemberBtn, 'button-reset')}
            onClick={handleAddMember}
          >
            <Text className={styles.addMemberBtnText}>+ 添加家属成员</Text>
          </Button>

          {allMembers.length > 0 ? (
            <View className={styles.memberList}>
              {allMembers.map(member => (
                <View key={member.id} className={styles.memberItem}>
                  <View className={styles.memberAvatar}>
                    <Text className={styles.memberAvatarText}>
                      {member.name.charAt(0)}
                    </Text>
                  </View>
                  <View className={styles.memberInfo}>
                    <Text className={styles.memberName}>
                      {member.name}
                      <View
                        className={classnames(styles.memberTag, {
                          [styles.tagAuthorized]: member.isAuthorized,
                          [styles.tagUnauthorized]: !member.isAuthorized
                        })}
                        style={{ display: 'inline-flex', verticalAlign: 'middle' }}
                      >
                        <Text className={styles.tagText}>
                          {member.isAuthorized ? '已授权' : '未授权'}
                        </Text>
                      </View>
                    </Text>
                    <Text className={styles.memberRole}>
                      {member.role} · {member.phone}
                    </Text>
                  </View>
                  <View className={styles.memberActions}>
                    <Button
                      className={classnames(styles.memberActionBtn, 'button-reset')}
                      onClick={() => handleCall(member.phone, member.name)}
                    >
                      <Text className={styles.memberActionBtnText}>📞</Text>
                    </Button>
                    <Button
                      className={classnames(styles.memberActionBtn, 'button-reset')}
                      onClick={() => handleToggleAuth(member.id, member.name)}
                    >
                      <Text className={styles.memberActionBtnText}>🔒</Text>
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="👨‍👩‍👧‍👦"
              title="暂无家属成员"
              description="添加家属成员，共享老人健康数据，协同照护"
              actionText="添加家属"
              onAction={handleAddMember}
            />
          )}
        </>
      )}

      {activeTab === 'messages' && (
        <>
          <SectionHeader title="留言交接" showAction={false} />

          <View className={styles.messageList}>
            {allMessages.length > 0 ? (
              allMessages.map(msg => (
                <View key={msg.id} className={styles.messageCard}>
                  <View className={styles.messageHeader}>
                    <View className={styles.messageSender}>
                      <Text className={styles.messageSenderText}>
                        {msg.senderName.charAt(0)}
                      </Text>
                    </View>
                    <View className={styles.messageInfo}>
                      <Text className={styles.messageName}>
                        {msg.senderName} · {msg.senderRole}
                      </Text>
                      <Text className={styles.messageTime}>
                        {formatRelativeTime(msg.timestamp)}
                      </Text>
                    </View>
                    {!msg.isRead && <View className={styles.messageUnread} />}
                  </View>
                  <Text className={styles.messageContent}>{msg.content}</Text>
                </View>
              ))
            ) : (
              <EmptyState
                icon="💬"
                title="暂无留言"
                description="家属之间可通过留言交接照护事项"
              />
            )}
          </View>

          <View className={styles.inputSection}>
            <Text className={styles.inputTitle}>发送留言给所有家属</Text>
            <Textarea
              className={styles.inputField}
              placeholder="请输入留言内容，例如：今日血压偏高，请家属关注..."
              value={messageInput}
              onInput={(e) => setMessageInput(e.detail.value)}
              maxlength={500}
            />
            <Button
              className={classnames(styles.submitBtn, 'button-reset')}
              onClick={handleSendMessage}
            >
              <Text className={styles.submitBtnText}>📤 发送留言</Text>
            </Button>
          </View>
        </>
      )}

      {activeTab === 'tasks' && (
        <>
          <SectionHeader
            title="照护任务"
            subtitle={`${pendingTasks}项待完成`}
            showAction={false}
          />

          {allTasks.length > 0 ? (
            allTasks.map(task => (
              <View key={task.id} className={styles.taskCard}>
                <View className={styles.taskHeader}>
                  <View className={styles.taskInfo}>
                    <Text className={styles.taskTitle}>{task.title}</Text>
                    <Text className={styles.taskAssigned}>
                      👤 负责人：{task.assignedName}
                    </Text>
                  </View>
                  <View
                    className={classnames(styles.taskStatusBadge, {
                      [styles.taskPending]: task.status === 'pending',
                      [styles.taskCompleted]: task.status === 'completed'
                    })}
                  >
                    <Text className={styles.taskStatusText}>
                      {task.status === 'pending' ? '待完成' : '已完成'}
                    </Text>
                  </View>
                </View>

                {task.description && (
                  <Text className={styles.taskDesc}>{task.description}</Text>
                )}

                <View className={styles.taskFooter}>
                  <Text className={styles.taskDue}>📅 截止：{task.dueDate}</Text>
                  {task.status === 'pending' ? (
                    <Button
                      className={classnames(styles.taskCompleteBtn, 'button-reset')}
                      onClick={() => handleCompleteTask(task.id, task.assignedName)}
                    >
                      <Text className={styles.taskCompleteBtnText}>✓ 确认完成</Text>
                    </Button>
                  ) : (
                    <Text className={styles.taskCompletedInfo}>
                      ✓ {task.completedBy} 于 {task.completedAt?.slice(5, 16).replace('T', ' ')} 完成
                    </Text>
                  )}
                </View>
              </View>
            ))
          ) : (
            <EmptyState
              icon="✅"
              title="暂无照护任务"
              description="分配照护任务给家属成员，共同完成照护工作"
            />
          )}
        </>
      )}
    </View>
  );
};

export default FamilyPage;
