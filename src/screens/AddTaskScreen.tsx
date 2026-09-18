import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTaskContext} from '../context/TaskContext';
import type {RootStackParamList} from '../navigation/AppNavigator';
import type {TaskPriority} from '../types/task';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

const AddTaskScreen = ({navigation}: Props) => {
  const {addTask} = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [category, setCategory] = useState('');

  const handleAddTask = async () => {
    if (!title.trim() || !dateTime.trim() || !deadline.trim()) {
      Alert.alert('Missing details', 'Please enter title, date/time and deadline.');
      return;
    }

    const createdTask = await addTask({
      title: title.trim(),
      description: description.trim(),
      dateTime: dateTime.trim(),
      deadline: deadline.trim(),
      priority,
      category: category.trim(),
      completed: false,
    });

    if (createdTask) {
      navigation.navigate('Home');
      return;
    }

    Alert.alert('Unable to add task', 'Please try again.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Add Task</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Task title"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add a short description"
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.label}>Date/time</Text>
            <TextInput
              style={styles.input}
              placeholder="Sep 18, 2026 at 10:00 AM"
              placeholderTextColor="#94A3B8"
              value={dateTime}
              onChangeText={setDateTime}
            />

            <Text style={styles.label}>Deadline</Text>
            <TextInput
              style={styles.input}
              placeholder="Sep 19, 2026"
              placeholderTextColor="#94A3B8"
              value={deadline}
              onChangeText={setDeadline}
            />

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {priorityOptions.map(option => {
                const isSelected = priority === option;

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.priorityOption,
                      isSelected && styles.priorityOptionSelected,
                    ]}
                    onPress={() => setPriority(option)}>
                    <Text
                      style={[
                        styles.priorityOptionText,
                        isSelected && styles.priorityOptionTextSelected,
                      ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Category/tag</Text>
            <TextInput
              style={styles.input}
              placeholder="Work, Personal, Design"
              placeholderTextColor="#94A3B8"
              value={category}
              onChangeText={setCategory}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddTask}>
              <Text style={styles.submitButtonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F6F8FB',
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 34,
  },

  header: {
    marginBottom: 22,
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

  title: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
  },

  form: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: 8,
    borderWidth: 1,
    padding: 18,
  },

  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#0F172A',
    fontSize: 16,
    height: 50,
    marginBottom: 16,
    paddingHorizontal: 14,
  },

  textArea: {
    height: 110,
    paddingTop: 14,
  },

  priorityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  priorityOption: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },

  priorityOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },

  priorityOptionText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },

  priorityOptionTextSelected: {
    color: '#1D4ED8',
  },

  submitButton: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    marginTop: 6,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default AddTaskScreen;
