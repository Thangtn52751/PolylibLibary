// src/screens/NotificationScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NotificationScreen({ navigation }) {
  const [notes, setNotes] = useState([]);

  const loadNotes = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch(`http://10.0.2.2:3000/api/notifications/user/${userId}`);
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load notifications');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadNotes);
    return unsubscribe;
  }, [navigation]);

  const handlePress = async (note) => {
    try {
      // mark as read
      await fetch(`http://10.0.2.2:3000/api/notifications/${note._id}/read`, {
        method: 'PUT',
      });
      navigation.navigate('NotificationDetail', { note });
    } catch {
      Alert.alert('Error', 'Could not mark as read');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.status === 0 && styles.unread]}
      onPress={() => handlePress(item)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={1} style={styles.excerpt}>{item.content}</Text>
      <Text style={styles.date}>
        {new Date(item.create_date).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>Notification</Text>
      <FlatList
        data={notes}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  item: {
    padding:12,
    borderBottomWidth:1,
    borderColor:'#eee'
  },
  title1: {marginBottom:20,fontSize:20, fontWeight:'bold'},
  unread: { backgroundColor:'#fdf6e3' },
  title: { fontWeight:'bold', fontSize:16 },
  excerpt: { color:'#555', marginTop:4 },
  date: { color:'#999', fontSize:12, marginTop:6 },
  empty: { textAlign:'center', color:'#999', marginTop:20 },
});
