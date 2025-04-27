// components/BookItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function BookItem({ book, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: book.image_url }} style={styles.bookImage} />
        {book.status === 'new' && (
          <Image
            source={require('../img/new2.gif')}
            style={styles.badge}
          />
        )}
      </View>
      <Text style={styles.title}>{book.book_name}</Text>
      <Text style={styles.author}>{book.auth}</Text>
      <Text style={styles.price}>{book.loan_price} VNĐ</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  bookImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 40,
    height: 40,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 6,
    color: '#222',
  },
  author: {
    color: '#555',
    fontSize: 12,
  },
  price: {
    color: '#d67e00',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
