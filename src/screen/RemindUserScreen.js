// src/screens/RemindUserScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, Alert, Button, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OPTIONS = [
  { key:'5days',  label:'5 Days Before Due' },
  { key:'3days',  label:'3 Days Before Due' },
  { key:'overdue',label:'Overdue Reminder' },
  { key:'custom', label:'Custom Message' }
];

export default function RemindUserScreen({ route, navigation }) {
  const { userId, fullname } = route.params;
  const [option, setOption]  = useState('5days');
  const [customMsg, setCustomMsg] = useState('');

  const sendNotification = async () => {
    let title, content;
    const dueDateStr = new Date().toLocaleDateString(); // demo, ideally pass actual due date

    switch(option) {
      case '5days':
        title   = '📢 5 Days Until Due';
        content = `Dear ${fullname}, your borrowed books are due in 5 days (${dueDateStr}). Please prepare to return them on time.`;
        break;
      case '3days':
        title   = '⚠️ 3 Days Left to Return';
        content = `Hello ${fullname}, this is a reminder: your loan is due in 3 days (${dueDateStr}).`;
        break;
      case 'overdue':
        title   = '❗ Overdue Notice';
        content = `Dear ${fullname}, your loan was due on ${dueDateStr}. Please return your books immediately.`;
        break;
      case 'custom':
        if (!customMsg.trim()) {
          return Alert.alert('Please enter your custom message');
        }
        title   = '📬 Message from Library';
        content = customMsg.trim();
        break;
      default:
        return;
    }

    try {
      const employeeId = await AsyncStorage.getItem('userId');
      await fetch('http://10.0.2.2:3000/api/notifications', {
        method: 'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          title,
          content,
          id_customer: userId,
          id_employee: employeeId
        })
      });
      Alert.alert('Success','Notification sent');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error','Could not send notification');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        Remind {fullname}
      </Text>

      {OPTIONS.map(o => (
        <TouchableOpacity
          key={o.key}
          style={[
            styles.option,
            option === o.key && styles.optionSelected
          ]}
          onPress={()=> setOption(o.key)}
        >
          <Text style={[
            styles.optionLabel,
            option===o.key && styles.optionLabelSelected
          ]}>
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}

      {option==='custom' && (
        <TextInput
          style={styles.input}
          placeholder="Enter your message..."
          multiline
          value={customMsg}
          onChangeText={setCustomMsg}
        />
      )}

      <View style={styles.footer}>
        <Button title="Send Reminder" onPress={sendNotification} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:16 },
  header:    { fontSize:20, fontWeight:'bold', marginBottom:20 },
  option:    {
    padding:12,
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:6,
    marginBottom:12
  },
  optionSelected: {
    backgroundColor:'#d67e00',
    borderColor:'#d67e00'
  },
  optionLabel: {
    fontSize:16,
    color:'#333'
  },
  optionLabelSelected: {
    color:'#fff',
    fontWeight:'bold'
  },
  input: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:6,
    padding:12,
    height:100,
    textAlignVertical:'top',
    marginBottom:20
  },
  footer: { marginTop:20 }
});
