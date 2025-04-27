import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView
} from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    address: '',
    passwd: '',
    confirm: ''
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
    if (form.passwd !== form.confirm) {
      Alert.alert('Error', 'Password does not match');
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          fullname: form.fullname,
          email: form.email,
          phone: form.phone,
          address: form.address,
          passwd: form.passwd
        })
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert('Thành công', 'Đăng ký thành công');
        navigation.navigate('Login');
      } else {
        Alert.alert('Lỗi', result.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput style={styles.input} placeholder="Username"
        value={form.username} onChangeText={text => handleChange('username', text)} />
      <TextInput style={styles.input} placeholder="Fullname"
        value={form.fullname} onChangeText={text => handleChange('fullname', text)} />
      <TextInput style={styles.input} placeholder="Email Address"
        value={form.email} onChangeText={text => handleChange('email', text)} />
      <TextInput style={styles.input} placeholder="Phone Number"
        value={form.phone} onChangeText={text => handleChange('phone', text)} />
      <TextInput style={styles.input} placeholder="Address"
        value={form.address} onChangeText={text => handleChange('address', text)} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry
        value={form.passwd} onChangeText={text => handleChange('passwd', text)} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry
        value={form.confirm} onChangeText={text => handleChange('confirm', text)} />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Already have an account?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          SIGN IN
        </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 12
  },
  button: {
    backgroundColor: '#d67e00', padding: 14,
    borderRadius: 8, alignItems: 'center', marginVertical: 12
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  bottomText: { textAlign: 'center' },
  link: { color: '#d67e00', fontWeight: 'bold' },
});
