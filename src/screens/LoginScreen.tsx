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

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem('registeredUser');

      if (!storedUser) {
        Alert.alert(
          'Account Not Found',
          'Please register an account first.',
        );
        return;
      }

      const user = JSON.parse(storedUser);

      if (
        email.trim().toLowerCase() !== user.email ||
        password !== user.password
      ) {
        Alert.alert(
          'Login Failed',
          'Invalid email or password.',
        );
        return;
      }

      // Save the login session.
      await AsyncStorage.setItem('isLoggedIn', 'true');

      navigation.replace('Home');
    } catch{
      Alert.alert(
        'Error',
        'Unable to login. Please try again.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.brand}>MyToDo</Text>

        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>
          Log in to manage your tasks.
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Don't have an account?{' '}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register</Text>
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

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  registerText: {
    color: '#64748B',
    fontSize: 15,
  },

  registerLink: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default LoginScreen;