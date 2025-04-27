// src/screens/NotificationDetail.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificationDetail({ route }) {
  const { note } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.date}>
        {new Date(note.create_date).toLocaleString()}
      </Text>
      <Text style={styles.content}>{note.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:8 },
  date: { color:'#999', fontSize:12, marginBottom:16 },
  content: { fontSize:16, lineHeight:24 }
});
