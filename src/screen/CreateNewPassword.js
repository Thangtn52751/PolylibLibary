import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function CreateNewPassword({ route, navigation }) {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = async () => {
    if (password !== confirm) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    try {
      const res = await fetch('http://10.0.2.2:3000/api/users/forgot-password/reset', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công');
        navigation.navigate('Login');
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (err) {
      Alert.alert('Lỗi khi gửi yêu cầu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 12
  },
  button: {
    backgroundColor: '#d67e00', padding: 14,
    borderRadius: 8, alignItems: 'center', marginTop: 12
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
