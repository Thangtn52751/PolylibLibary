import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function ForgotPasswordStep2({ navigation, route }) {
  const { email } = route.params;
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleVerify = async () => {
    const otp = code.join('');
    try {
      const res = await fetch('http://10.0.2.2:3000/api/users/forgot-password/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp }),
      });

      const result = await res.json();

      if (res.ok) {
        navigation.navigate('CreateNewPassword', { email });
      } else {
        Alert.alert('Wrong code', 'The verification code is not right.');
      }
    } catch (err) {
      Alert.alert('error', 'Cannot connect to the server. Please try again later.');
    }
  };

  const handleChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Please type the code from email</Text>

      <View style={styles.otpRow}>
        {[0, 1, 2, 3].map((_, i) => (
          <TextInput
            key={i}
            ref={ref => (inputs.current[i] = ref)}
            style={styles.otpBox}
            maxLength={1}
            keyboardType="number-pad"
            value={code[i]}
            onChangeText={text => handleChange(text, i)}
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleVerify} style={{ marginTop: 20, backgroundColor: '#d67e00', padding: 12, borderRadius: 8 }}>
        <Text style={styles.verifyBtn}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { color: '#555', marginBottom: 20 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  otpBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, textAlign: 'center', fontSize: 18, width: 50
  },
  verifyBtn: { textAlign: 'center', color: 'white', fontWeight: 'bold' },
});
