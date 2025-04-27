// src/screens/HomeScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Banner from '../components/Banner';
import BookItem from '../components/BookItem';

export default function HomeScreen({ navigation }) {
  const [user, setUser]             = useState(null);
  const [bookTypes, setBookTypes]   = useState([]);
  const [books, setBooks]           = useState([]);
  const [unreadNotes, setUnreadNotes] = useState([]);

  // reload when this screen comes into focus
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      loadUserAndBooks();
      loadUnreadNotifications();
    });
    return unsub;
  }, [navigation]);

  // 1) load current user + book catalog
  const loadUserAndBooks = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const [uRes, typesRes, booksRes] = await Promise.all([
        fetch(`http://10.0.2.2:3000/api/users/${userId}`),
        fetch('http://10.0.2.2:3000/api/bookTypes'),
        fetch('http://10.0.2.2:3000/api/books'),
      ]);
      if (!uRes.ok || !typesRes.ok || !booksRes.ok) throw new Error();

      const [uData, typesData, booksData] = await Promise.all([
        uRes.json(),
        typesRes.json(),
        booksRes.json(),
      ]);

      setUser(uData);
      setBookTypes(typesData);
      setBooks(booksData);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load user or book data');
    }
  };

  // 2) fetch **all** unread notifications for this user
  const loadUnreadNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const res   = await fetch(`http://10.0.2.2:3000/api/notifications/user/${userId}`);
      const notes = await res.json();
      // only unread
      const unread = notes.filter(n => n.status === 0);
      setUnreadNotes(unread);
    } catch (err) {
      console.error(err);
    }
  };

  // 3) when the banner is tapped, mark all unread as read then navigate
  const onBannerPress = async () => {
    try {
      await Promise.all(
        unreadNotes.map(n =>
          fetch(`http://10.0.2.2:3000/api/notifications/${n._id}/read`, {
            method: 'PUT',
          })
        )
      );
      setUnreadNotes([]);         // clear banner immediately
      navigation.navigate('Notification');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not mark notifications as read');
    }
  };

  // helper to render each book‐type section
  const renderBooksByType = type => {
    const list = books.filter(b => b.book_type?.type === type);
    if (!list.length) return null;
    return (
      <View key={type}>
        <Text style={styles.sectionTitle}>{type}</Text>
        <View style={styles.bookRow}>
          {list.map(book => (
            <BookItem
            key={book._id}
            book={book}
            onPress={() => navigation.navigate('BookDetail', { bookId: book._id })}
          />
          ))}
        </View>
      </View>
    );
  };

  // banner text: count + latest title
  const bannerText = unreadNotes.length > 1
    ? `You have ${unreadNotes.length} new notifications. Latest: “${unreadNotes[0].title}”`
    : `You have 1 new notification: “${unreadNotes[0]?.title}”`;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>
        Welcome{user ? `, ${user.username}` : ''}!
      </Text>

      {unreadNotes.length > 0 && (
        <TouchableOpacity style={styles.alertBox} onPress={onBannerPress}>
          <Text style={styles.alertText}>{bannerText}</Text>
        </TouchableOpacity>
      )}

      <Banner />

      {bookTypes.map(t => renderBooksByType(t.type))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, padding: 16, backgroundColor: '#fff' },
  welcome:      { fontSize: 18, fontWeight: '500', marginBottom: 12, color: '#d67e00' },

  alertBox:     {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEEBA',
    marginBottom: 16,
  },
  alertText:    { color: '#856404', fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 12, color: '#d67e00' },
  bookRow:      { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  bookItem:     { width: '48%', marginBottom: 16 },
  bookImage:    { width: '100%', height: 200, borderRadius: 8, marginBottom: 6 },
  bookTitle:    { fontWeight: 'bold', fontSize: 14, color: '#222' },
  bookAuthor:   { color: '#555', fontSize: 12 },
  bookPrice:    { color: '#d67e00', fontWeight: 'bold', marginTop: 4 },
});
