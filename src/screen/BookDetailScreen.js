// src/screen/BookDetailScreen.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookDetailScreen({ route }) {
  const { bookId } = route.params;

  // Book details
  const [book, setBook] = useState(null);

  // Modal + note
  const [modalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState('');

  // Borrow guard
  const [canBorrow, setCanBorrow] = useState(true);
  const [borrowStatus, setBorrowStatus] = useState(null);
  
  // Pulse animation value
  const pulse = useRef(new Animated.Value(1)).current;

  // 1) Load book details
  useEffect(() => {
    fetch(`http://10.0.2.2:3000/api/books/${bookId}`)
      .then(res => res.json())
      .then(setBook)
      .catch(() => Alert.alert('Error','Failed to load book'));
  }, [bookId]);

  // 2) Check existing registration
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const res = await fetch('http://10.0.2.2:3000/api/regbooks');
        const all = await res.json();

        // Find a regbook for this user & this book in status 0 or 1
        const existing = all.find(r => {
          const mine =
            r.id_customer === userId ||
            r.id_customer?._id === userId;
          const hasBook = r.loan_bookid?.some(
            b => b.book_id?._id === bookId
          );
          const pendingOrApproved = [0,1].includes(r.status);
          return mine && hasBook && pendingOrApproved;
        });

        if (existing) {
          setCanBorrow(false);
          setBorrowStatus(existing.status);
        }
      } catch (err) {
        console.warn('Check borrow status failed', err);
      }
    };

    checkExisting();
  }, [bookId]);

  // 3) Pulse animation when pending
  useEffect(() => {
    if (borrowStatus === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true
          }),
          Animated.timing(pulse, {
            toValue: 0.9,
            duration: 600,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [borrowStatus, pulse]);

  // 4) Submit loan request
  const handleLoan = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch('http://10.0.2.2:3000/api/regbooks', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          id_customer: userId,
          loan_bookid: [{ book_id: bookId, quantity: 1 }],
          note
        })
      });
      if (!res.ok) throw new Error();
      Alert.alert('Success','Your loan request was sent');
      setCanBorrow(false);
      setBorrowStatus(0);
      setNote('');
      setModalVisible(false);
    } catch {
      Alert.alert('Error','Could not submit request');
    }
  };

  if (!book) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri:book.image_url }}
        style={styles.image}
      />
      <Text style={styles.title}>{book.book_name}</Text>
      <Text style={styles.author}>By {book.auth}</Text>
      <Text style={styles.price}>Loan Price: {book.loan_price} VNĐ</Text>
      <Text style={styles.desc}>{book.des}</Text>

      <Animated.View
        style={[
          styles.loanBtn,
          !canBorrow && styles.loanBtnDisabled,
          borrowStatus === 0 && { transform:[{ scale: pulse }] }
        ]}
      >
        <TouchableOpacity
          style={styles.loanInner}
          disabled={!canBorrow}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.loanText}>
            {canBorrow
              ? 'Loans'
              : borrowStatus === 0
                ? 'Pending…'
                : 'Already Borrowed'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter a note</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Your note…"
              value={note}
              onChangeText={setNote}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.submitBtn]}
                onPress={handleLoan}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex:1,
    textAlign:'center',
    marginTop:50
  },
  container: {
    padding:16,
    backgroundColor:'#fff'
  },
  image: {
    width:'100%',
    height:600,
    borderRadius:8,
    marginBottom:12
  },
 
  title: {
    fontSize:20,
    fontWeight:'bold',
    marginBottom:6
  },
  author: {
    color:'#555',
    marginBottom:12
  },
  desc: {
    fontSize:16,
    color:'#333'
  },

  loanBtn: {
    borderRadius:8,
    overflow:'hidden',
    marginTop:20
  },
  loanInner: {
    backgroundColor:'#d67e00',
    padding:14,
    alignItems:'center'
  },
  loanBtnDisabled: {
    backgroundColor:'#aaa'
  },
  loanText: {
    color:'#fff',
    fontWeight:'bold'
  },

  modalOverlay: {
    flex:1,
    backgroundColor:'rgba(0,0,0,0.3)',
    justifyContent:'center',
    alignItems:'center'
  },
  modalBox: {
    width:'80%',
    backgroundColor:'#fff',
    borderRadius:8,
    padding:16
  },
  modalTitle: {
    fontSize:18,
    fontWeight:'bold',
    marginBottom:12
  },
  modalInput: {
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:6,
    padding:8,
    marginBottom:16
  },
  modalActions: {
    flexDirection:'row',
    justifyContent:'flex-end'
  },
  modalBtn: {
    paddingVertical:8,
    paddingHorizontal:16,
    borderRadius:6,
    marginLeft:8
  },
  cancelBtn: {
    backgroundColor:'#eee'
  },
  submitBtn: {
    backgroundColor:'#d67e00'
  },
  submitText: {
    color:'#fff',
    fontWeight:'bold'
  },
  price:{
    fontWeight:'bold',
    color:'#d67e00'
  }
});
