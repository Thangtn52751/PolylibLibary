import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [passwd, setPasswd] = useState('');

  const handleLogin = async () => {
    if(!username.length == 0 || !passwd.length == 0) {
    try {
      const res = await fetch('http://10.0.2.2:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passwd }),
      });
      const result = await res.json();

     
      if (res.ok) {
        const { token, user } = result;            // pull token & user
        const { _id, username: name, role } = user; // pull id, username, role
  
        // save to AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userId', _id);
        await AsyncStorage.setItem('username', name);
        await AsyncStorage.setItem('userRole', role.toString());
  
        Alert.alert('Success', 'Login successful');
  
        // navigate based on user.role
        if (role === 1) {
          navigation.navigate('Employee');
        } else if (role === 2) {
          navigation.navigate('Admin');
        } else {
          navigation.navigate('Home');
        }
  
      } else {
        Alert.alert('Error', result.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server');
    }
  }else {
     if(username.length == 0 || passwd.length == 0) {
      Alert.alert('Are you kidding me?', 'Fill your username and password please')
    } 
    if(username.length == 0) {
      Alert.alert('Username Empty','Please fill out your username')
    }
     if(passwd.length == 0) {
      Alert.alert('Password Empty', 'Please fill out your password')
    }
  }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={passwd}
        onChangeText={setPasswd}
      />

      <TouchableOpacity
        style={styles.buttonForgot}
        onPress={() => navigation.navigate('ForgotPasswordStep1')}
      >
        <Text style={styles.forgottxt}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Are you a new member?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
          SIGN UP
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 12
  },
  button: {
    backgroundColor: '#d67e00', padding: 14,
    borderRadius: 8, alignItems: 'center', marginBottom: 12
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  bottomText: { textAlign: 'center' },
  link: { color: '#d67e00', fontWeight: 'bold' },
  buttonForgot: { alignItems: 'flex-end', marginBottom: 12 },
  forgottxt: { color: '#d67e00', fontWeight: 'bold' },
});
