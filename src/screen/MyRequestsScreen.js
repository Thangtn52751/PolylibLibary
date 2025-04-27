// src/screen/MyRequestsScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS = {
  ALL: 'all',
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
};

export default function MyRequestsScreen({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState(STATUS.ALL);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // fetch only this user’s requests
  const fetchMine = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch('http://10.0.2.2:3000/api/regbooks');
      const all = await res.json();
      const mine = all.filter(r => r.id_customer && r.id_customer._id === userId);
      setRequests(mine);
    } catch {
      Alert.alert('Error', 'Cannot load your requests');
    }
  };

  useEffect(() => {
    fetchMine();
  }, []);

  // open cancel modal
  const openCancel = (id) => {
    setCancelId(id);
    setCancelReason('');
    setModalVisible(true);
  };

  // confirm cancellation
  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('Please enter a reason');
      return;
    }
    try {
      await fetch(`http://10.0.2.2:3000/api/regbooks/${cancelId}`, {
        method: 'DELETE'
      });
      setRequests(q => q.filter(r => r._id !== cancelId));
    } catch {
      Alert.alert('Error', 'Could not cancel');
    }
    setModalVisible(false);
  };

  // apply filter
  const filtered = requests.filter(r => {
    if (filter === STATUS.ALL) return true;
    return r.status === filter;
  });

  const renderItem = ({ item }) => {
    // take first book’s image
    const firstLoan = Array.isArray(item.loan_bookid) && item.loan_bookid[0];
    const book = firstLoan && firstLoan.book_id;
    const uri = book?.image_url
      ? book.image_url
      : 'https://via.placeholder.com/60';

    const statusMap = {
      [STATUS.PENDING]:  { label: 'Pending',  style: styles.pending },
      [STATUS.APPROVED]: { label: 'Approved', style: styles.approved },
      [STATUS.REJECTED]: { label: 'Rejected', style: styles.rejected },
    };
    const { label, style } = statusMap[item.status] || statusMap[STATUS.PENDING];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('BookDetail', { bookId: book._id })}
      >
        <Image source={{ uri }} style={styles.bookImage} />
        <View style={styles.info}>
          <Text style={styles.title}>
            { item.loan_bookid.map(b => b.book_id.book_name).join(', ') }
          </Text>
          <Text style={[styles.status, style]}>
            Status: {label}
          </Text>

          {/* show rejection reason if rejected */}
          {item.status === STATUS.REJECTED && item.note ? (
            <Text style={styles.rejectNote}>
              Reason: {item.note}
            </Text>
          ) : null}

          {item.status === STATUS.PENDING && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => openCancel(item._id)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {[
          { key: STATUS.ALL,      label: 'All' },
          { key: STATUS.PENDING,  label: 'Pending' },
          { key: STATUS.REJECTED, label: 'Rejected' },
        ].map(btn => (
          <TouchableOpacity
            key={btn.key}
            style={[
              styles.filterBtn,
              filter === btn.key && styles.filterBtnActive
            ]}
            onPress={() => setFilter(btn.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter === btn.key && styles.filterTextActive
              ]}
            >
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={r => r._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No requests</Text>}
      />


      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Cancel Request</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Reason for cancellation"
              value={cancelReason}
              onChangeText={setCancelReason}
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.btn, styles.btnCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btnConfirm]}
                onPress={confirmCancel}
              >
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#fff' },
  filterRow:   {
    flexDirection:  'row',
    justifyContent: 'space-around',
    paddingVertical:12,
    borderBottomWidth:1,
    borderColor:    '#eee'
  },
  filterBtn:         {
    paddingVertical:   6,
    paddingHorizontal: 12,
    borderRadius:      20,
    backgroundColor:   '#f0f0f0'
  },
  filterBtnActive:   { backgroundColor: '#d67e00' },
  filterText:        { color: '#333' },
  filterTextActive:  { color: '#fff', fontWeight: 'bold' },

  card:        {
    flexDirection: 'row',
    borderWidth:   1,
    borderColor:   '#ddd',
    borderRadius:  6,
    margin:        12,
    overflow:      'hidden'
  },
  bookImage:   { width: 120, height: 120 },
  info:        { flex: 1, padding: 8 },
  title:       { fontWeight: 'bold', marginBottom: 4 },
  status:      { fontWeight: 'bold', marginBottom: 6 },
  pending:     { color: '#FFA500' },
  approved:    { color: '#4CAF50' },
  rejected:    { color: '#F44336' },
  rejectNote:  {
    fontStyle: 'italic',
    color:     '#F44336',
    marginBottom: 6
  },

  cancelBtn:   {
    marginTop:       8,
    backgroundColor: '#f44336',
    paddingVertical: 6,
    paddingHorizontal:12,
    borderRadius:     4,
    alignSelf:        'flex-start'
  },
  cancelText:  { color: '#fff', fontWeight: 'bold' },
  empty:       { textAlign: 'center', marginTop: 50, color: '#777' },

  backdrop:    {
    flex:              1,
    backgroundColor:   'rgba(0,0,0,0.4)',
    justifyContent:    'center',
    alignItems:        'center'
  },
  modal:       {
    width:            '80%',
    backgroundColor:  '#fff',
    borderRadius:     8,
    padding:          16
  },
  modalTitle:  {
    fontSize:     18,
    fontWeight:   'bold',
    marginBottom: 12
  },
  modalInput:  {
    borderWidth:   1,
    borderColor:   '#ccc',
    borderRadius:  6,
    padding:       10,
    marginBottom:  16
  },
  modalBtns:   { flexDirection: 'row', justifyContent: 'flex-end' },
  btn:          {
    paddingVertical:   8,
    paddingHorizontal: 14,
    borderRadius:      6,
    marginLeft:        8
  },
  btnCancel:   { backgroundColor: '#ccc' },
  btnConfirm:  { backgroundColor: '#d67e00' },
  btnText:     { color: '#fff', fontWeight: 'bold' },
});
