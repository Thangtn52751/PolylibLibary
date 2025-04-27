// src/screens/ProfileScreen.js

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({
    username: '',
    email: '',
    fullname: '',
    avatar: '',
    address: ''
  });

  // Re‑fetch user data every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (!userId) return;
          const res = await fetch(`http://10.0.2.2:3000/api/users/${userId}`);
          if (!res.ok) throw new Error('Server error');
          const data = await res.json();
          setUser(data);
        } catch (err) {
          Alert.alert('Error', 'Failed to load user data');
        }
      };
      fetchUser();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const goToReturn = () => {
    // climb up into the parent (root) stack
    navigation
      .getParent()            
      ?.navigate('ReturnUser', {    
        userId: user._id        
      });
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={
            user.avatar
              ? { uri: `http://10.0.2.2:3000${user.avatar}` }
              : require('../img/logo.png')
          }
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{user.fullname}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.address}>{user.address}</Text>
        </View>
      </View>

      {/* Section Title */}
      <Text style={styles.sectionTitle}>Profile Options</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.buttonText}>✏️  Edit Account</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Books Options</Text>

      {/* Action Buttons */}
      <TouchableOpacity
      onPress={() => navigation.navigate('MyRequest')}
       style={styles.button}>
        <Text style={styles.buttonText}>📚  View Borrow Request</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={() => navigation.navigate('LoanSlip')}
       style={styles.button}>
        <Text style={styles.buttonText}>📃  View Borrowing Slip</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goToReturn}>
        <Text style={styles.buttonText}>📗 Return Borrowed Books</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>🚪  Sign Out</Text>
      </TouchableOpacity>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    backgroundColor: '#5b3f39',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  email: {
    color: '#fff',
    marginTop: 4,
    fontSize: 13,
  },
  address: {
    color: '#fff',
    marginTop: 5,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#d67e00',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
