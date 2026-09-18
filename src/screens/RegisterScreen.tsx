import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    try {
      await AsyncStorage.setItem(
        'registeredUser',
        JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      );

      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please login to continue.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to create account. Please try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.brand}>MyToDo</Text>

        <Text style={styles.title}>Create account</Text>

        <Text style={styles.subtitle}>
          Register to start organizing tasks.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#94A3B8"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FB',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  brand: {
    color: '#2563EB',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#D8E0EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    fontSize: 16,
    color: '#0F172A',
  },

  button: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  loginText: {
    color: '#64748B',
    fontSize: 15,
  },

  loginLink: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default RegisterScreen;