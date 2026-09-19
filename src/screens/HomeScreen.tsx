import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import TaskCard from '../components/TaskCard';
import {useTaskContext} from '../context/TaskContext';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({navigation}: Props) => {
  const {tasks, loading, error, refreshTasks} = useTaskContext();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const emptyTitle = loading ? 'Loading tasks' : 'No tasks yet';

  const emptyText = loading
    ? 'Fetching your tasks from the server.'
    : error ?? 'Add your first task to start organizing your day.';

  const emptyActionLabel = loading
    ? 'Please Wait'
    : error
      ? 'Try Again'
      : 'Add Task';

  const handleTaskPress = (taskId: string) => {
    navigation.navigate('TaskDetails', {taskId});
  };

  const handleEmptyAction = () => {
    if (loading) {
      return;
    }

    if (error) {
      refreshTasks();
      return;
    }

    navigation.navigate('AddTask');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Remove only the login session.
              // The registered account remains saved.
              await AsyncStorage.removeItem('isLoggedIn');

              navigation.replace('Login');
            } catch {
              Alert.alert(
                'Logout Failed',
                'Unable to logout. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Dashboard</Text>
            <Text style={styles.title}>My Tasks</Text>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTask')}>
              <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalTasks}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{pendingTasks}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          refreshing={loading}
          onRefresh={refreshTasks}
          renderItem={({item}) => (
            <TaskCard task={item} onPress={handleTaskPress} />
          )}
          contentContainerStyle={
            tasks.length === 0 ? styles.emptyList : styles.list
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{emptyTitle}</Text>

              <Text style={styles.emptyText}>{emptyText}</Text>

              <TouchableOpacity
                style={styles.emptyButton}
                onPress={handleEmptyAction}
                disabled={loading}>
                <Text style={styles.emptyButtonText}>
                  {emptyActionLabel}
                </Text>
              </TouchableOpacity>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F8FB',
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  eyebrow: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },

  title: {
    color: '#0F172A',
    fontSize: 32,
    fontWeight: '800',
  },

  headerButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  logoutButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },

  addButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },

  statCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },

  statValue: {
    color: '#0F172A',
    fontSize: 24,
    fontWeight: '800',
  },

  statLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },

  list: {
    paddingBottom: 24,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 24,
    padding: 28,
  },

  emptyTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },

  emptyText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },

  emptyButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default HomeScreen;