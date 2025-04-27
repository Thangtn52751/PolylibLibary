import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function ForgotPasswordStep1({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSendCode = async () => {
    try {
      const res = await fetch('http://10.0.2.2:3000/api/users/forgot-password/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.ok) {
        Alert.alert('✅ Susscess', 'Please check your email for the verification code.');
        navigation.navigate('ForgotPasswordStep2', { email });
      } else {
        Alert.alert('❌ Error', result.message);
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Cannot connect to the server. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendCode}>
        <Text style={styles.buttonText}>Recover Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20 },
  button: { backgroundColor: '#d67e00', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
