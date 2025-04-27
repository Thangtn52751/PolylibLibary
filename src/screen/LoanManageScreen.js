// src/screen/LoanManageScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Platform,
  Alert,
  Button,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoanManageScreen() {
  const [loans, setLoans]               = useState([]);
  const [loading, setLoading]           = useState(false);

  // modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLoanId, setCurrentLoanId] = useState(null);
  const [pickedDate, setPickedDate]     = useState(new Date());
  const [showPicker, setShowPicker]     = useState(false);

  // fetch all loans
  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res  = await fetch('http://10.0.2.2:3000/api/loans');
      const data = await res.json();
      setLoans(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert('Error', 'Could not load loan slips');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // open modal to pick date
  function openModal(loan) {
    setCurrentLoanId(loan._id);
    const existing = loan.return_date ? new Date(loan.return_date) : new Date();
    setPickedDate(existing);
    setShowPicker(false);
    setModalVisible(true);
  }

  // save new return date
  async function saveReturnDate() {
    try {
      const employeeId = await AsyncStorage.getItem('userId');
      await fetch(`http://10.0.2.2:3000/api/loans/${currentLoanId}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          id_employee:  employeeId,
          return_date:  pickedDate.toISOString(),
        }),
      });
      setModalVisible(false);
      fetchLoans();
    } catch {
      Alert.alert('Error', 'Could not update return date');
    }
  }

  const renderLoan = ({ item }) => {
    const borrower = item.id_customer?.fullname || 'Unknown';

    const loanDate   = item.loan_date
      ? new Date(item.loan_date).toLocaleDateString()
      : '—';
    const returnDate = item.return_date
      ? new Date(item.return_date).toLocaleDateString()
      : '—';

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Borrower:</Text>
          <Text>{borrower}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Loaned:</Text>
          <Text>{loanDate}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Due:</Text>
          <Text style={styles.due}>{returnDate}</Text>
        </View>

        {Array.isArray(item.borrow_book) && item.borrow_book.map((b, i) => (
          <Text key={i} style={styles.bookLine}>
            • {b.book_id?.book_name || 'Unknown Book'} x{b.quantity}
          </Text>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={() => openModal(item)}
        >
          <Text style={styles.buttonText}>Set Return Date</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{  fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    color: '#d67e00'}}>Customer Loans Slips</Text>
      {loading
        ? <ActivityIndicator style={{ marginTop: 20 }} />
        : loans.length === 0
          ? <Text style={styles.empty}>No loan slips</Text>
          : <FlatList
              data={loans}
              keyExtractor={l => l._id}
              renderItem={renderLoan}
            />
      }

      {/* Return‐Date Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Due Date</Text>

            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowPicker(true)}
            >
              <Text>{pickedDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={pickedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  setShowPicker(false);
                  if (date) setPickedDate(date);
                }}
              />
            )}

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                color="#888"
                onPress={() => setModalVisible(false)}
              />
              <Button
                title="Save"
                onPress={saveReturnDate}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container:    { flex:1, backgroundColor:'#fff', padding:16 },
  empty:        { textAlign:'center', marginTop:50, color:'#777' },

  card:         {
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:6,
    padding:12,
    marginBottom:16
  },
  row:          {
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:6
  },
  label:        { fontWeight:'bold' },
  due:          { color:'#d67e00', fontWeight:'600' },
  bookLine:     { marginLeft:8, marginBottom:4 },

  button:       {
    marginTop:12,
    backgroundColor:'#d67e00',
    paddingVertical:8,
    borderRadius:6,
    alignItems:'center'
  },
  buttonText:   { color:'#fff', fontWeight:'bold' },

  backdrop:     {
    flex:1,
    backgroundColor:'rgba(0,0,0,0.4)',
    justifyContent:'center',
    alignItems:'center'
  },
  modal:        {
    width:'80%',
    backgroundColor:'#fff',
    borderRadius:8,
    padding:16
  },
  modalTitle:   { fontSize:18, fontWeight:'bold', marginBottom:12 },
  dateBtn:      {
    padding:12,
    backgroundColor:'#f0f0f0',
    borderRadius:6,
    marginBottom:16,
    alignItems:'center'
  },
  modalActions: {
    flexDirection:'row',
    justifyContent:'space-between'
  }
});
