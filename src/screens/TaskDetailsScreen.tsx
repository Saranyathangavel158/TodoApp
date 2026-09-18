import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';
import {useTaskContext} from '../context/TaskContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TaskDetails'>;

const TaskDetailsScreen = ({navigation, route}: Props) => {
  const {taskId} = route.params;
  const {getTaskById, toggleTaskCompleted, deleteTask} = useTaskContext();
  const task = getTaskById(taskId);

  if (!task) {
    navigation.navigate('Home');
    return null;
  }

  const handleMarkCompleted = async () => {
    const updatedTask = await toggleTaskCompleted(task.id);
    if (updatedTask) {
      Alert.alert('Task updated', 'Marked as completed.');
      return;
    }

    Alert.alert('Unable to update task', 'Please try again.');
  };

  const handleDelete = () => {
    Alert.alert('Delete task', 'This local task will be removed from view.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const deleted = await deleteTask(task.id);
          if (deleted) {
            navigation.navigate('Home');
            return;
          }

          Alert.alert('Unable to delete task', 'Please try again.');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {task.completed ? 'Completed' : 'Pending'}
            </Text>
          </View>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>

        <View style={styles.detailCard}>
          <DetailRow label="Date/time" value={task.dateTime} />
          <DetailRow label="Deadline" value={task.deadline} />
          <DetailRow label="Priority" value={task.priority} />
          <DetailRow label="Category" value={task.category} />
          <DetailRow
            label="Status"
            value={task.completed ? 'Completed' : 'Pending'}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            task.completed && styles.disabledButton,
          ]}
          onPress={handleMarkCompleted}
          disabled={task.completed}>
          <Text style={styles.primaryButtonText}>
            {task.completed ? 'Completed' : 'Mark completed'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

type DetailRowProps = {
  label: string;
  value: string;
};

const DetailRow = ({label, value}: DetailRowProps) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F8FB',
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 34,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingVertical: 6,
  },

  backButtonText: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '700',
  },

  headerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 18,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  statusText: {
    color: '#3730A3',
    fontSize: 12,
    fontWeight: '800',
  },

  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: 10,
  },

  description: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },

  detailCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 18,
    paddingHorizontal: 18,
  },

  detailRow: {
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    paddingVertical: 16,
  },

  detailLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 5,
    textTransform: 'uppercase',
  },

  detailValue: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },

  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    marginBottom: 12,
  },

  disabledButton: {
    backgroundColor: '#94A3B8',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#FCA5A5',
    borderRadius: 8,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default TaskDetailsScreen;
