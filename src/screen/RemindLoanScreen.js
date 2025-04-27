// src/screens/RemindLoanScreen.js
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OPTIONS = [
  { key:'5days',  label:'5 Days Before Due' },
  { key:'3days',  label:'3 Days Before Due' },
  { key:'overdue',label:'Overdue Notice' },
  { key:'custom', label:'Custom Message' }
];

export default function RemindLoanScreen({ route, navigation }) {
  const { loanId, fullname, dueDate } = route.params;
  const [option, setOption] = useState('5days');
  const [customMsg, setCustomMsg] = useState('');

  const sendNotification = async () => {
    let title, content;
    switch(option) {
      case '5days':
        title   = '📢 5 Days Until Due';
        content = `Dear ${fullname}, your loan is due on ${dueDate}. Please prepare to return in 5 days.`;
        break;
      case '3days':
        title   = '⚠️ 3 Days Left to Return';
        content = `Hello ${fullname}, reminder: your loan is due on ${dueDate} (3 days).`;
        break;
      case 'overdue':
        title   = '❗ Overdue Notice';
        content = `Dear ${fullname}, your loan was due on ${dueDate}. Please return immediately.`;
        break;
      case 'custom':
        if (!customMsg.trim()) {
          return Alert.alert('Please enter a message');
        }
        title   = '📬 Library Message';
        content = customMsg.trim();
        break;
    }

    try {
      const employeeId = await AsyncStorage.getItem('userId');
      await fetch('http://10.0.2.2:3000/api/notifications', {
        method: 'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          title,
          content,
          id_customer: route.params.userId,  // you may also pass userId via params
          id_employee: employeeId,
          loan_ref:    loanId               // optional: record which loan
        })
      });
      Alert.alert('Success','Reminder sent');
    } catch {
      Alert.alert('Error','Could not send reminder');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Remind {fullname}</Text>
      <Text style={styles.sub}>Due Date: {dueDate}</Text>

      {OPTIONS.map(o=>(
        <TouchableOpacity
          key={o.key}
          style={[styles.opt, option===o.key && styles.optSel]}
          onPress={()=> setOption(o.key)}
        >
          <Text style={[styles.optText, option===o.key&&styles.optTextSel]}>
            {o.label}
          </Text>
        </TouchableOpacity>
      ))}

      {option==='custom' && (
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          multiline
          value={customMsg}
          onChangeText={setCustomMsg}
        />
      )}

      <TouchableOpacity style={styles.btn} onPress={sendNotification}>
        <Text style={styles.btnText}>Send Reminder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff',padding:16},
  header:{fontSize:20,fontWeight:'bold',marginBottom:8},
  sub:{marginBottom:16,color:'#666'},
  opt:{padding:12,borderWidth:1,borderColor:'#ddd',borderRadius:6,marginBottom:12},
  optSel:{backgroundColor:'#d67e00',borderColor:'#d67e00'},
  optText:{color:'#333'},
  optTextSel:{color:'#fff',fontWeight:'bold'},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:12,height:100,textAlignVertical:'top',marginBottom:16},
  btn:{backgroundColor:'#d67e00',padding:14,borderRadius:8,alignItems:'center'},
  btnText:{color:'#fff',fontWeight:'bold'}
});
