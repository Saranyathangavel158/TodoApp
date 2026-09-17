import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {Task, TaskPriority} from '../types/task';

type Props = {
  task: Task;
  onPress: (taskId: string) => void;
};

const priorityStyles: Record<TaskPriority, {backgroundColor: string; color: string}> =
  {
    Low: {
      backgroundColor: '#DCFCE7',
      color: '#166534',
    },
    Medium: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
    },
    High: {
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
    },
  };

const TaskCard = ({task, onPress}: Props) => {
  const priorityStyle = priorityStyles[task.priority];
  const isCompleted = task.completed;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(task.id)}
      activeOpacity={0.82}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={[styles.title, isCompleted && styles.completedTitle]}>
            {task.title}
          </Text>
          <Text style={styles.date}>Due {task.deadline}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isCompleted ? styles.completedBadge : styles.pendingBadge,
          ]}>
          <Text
            style={[
              styles.statusText,
              isCompleted ? styles.completedText : styles.pendingText,
            ]}>
            {isCompleted ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View
          style={[
            styles.priorityBadge,
            {backgroundColor: priorityStyle.backgroundColor},
          ]}>
          <Text style={[styles.priorityText, {color: priorityStyle.color}]}>
            {task.priority}
          </Text>
        </View>

        <Text style={styles.category}>{task.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },

  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  titleGroup: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
  },

  completedTitle: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },

  date: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 6,
  },

  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  pendingBadge: {
    backgroundColor: '#EEF2FF',
  },

  completedBadge: {
    backgroundColor: '#ECFDF5',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  pendingText: {
    color: '#3730A3',
  },

  completedText: {
    color: '#047857',
  },

  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 16,
  },

  priorityBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  priorityText: {
    fontSize: 12,
    fontWeight: '700',
  },

  category: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default TaskCard;
