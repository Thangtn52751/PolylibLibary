import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReturnRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(false);

  // 1) load all return-requests
  const loadRequests = async () => {
    setLoading(true);
    try {
      const res  = await fetch('http://10.0.2.2:3000/api/returns');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load return requests');
    }
    setLoading(false);
  };

  useEffect(() => { loadRequests(); }, []);

  // 2) Approve = DELETE return + its loan
  const handleApprove = async (ret) => {
    try {
      await fetch(`http://10.0.2.2:3000/api/returns/${ret._id}`, {
        method: 'DELETE'
      });
      Alert.alert('Approved', 'Return accepted; loan removed');
      loadRequests();
    } catch {
      Alert.alert('Error', 'Failed to approve');
    }
  };

  // 3) Reject = notify user via notifications API
  const handleReject = async (ret) => {
    try {
      const employeeId = await AsyncStorage.getItem('userId');
      const loanDate   = ret.id_loans?.loan_date
        ? new Date(ret.id_loans.loan_date).toLocaleDateString()
        : 'Unknown';

      await fetch('http://10.0.2.2:3000/api/notifications', {
        method: 'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          title:       '❌ Return Request Rejected',
          content:     `Dear ${ret.id_costumer.fullname}, your return of loan from ${loanDate} was rejected. Please contact staff.`,
          id_customer: ret.id_costumer._id,
          id_employee: employeeId
        })
      });

      Alert.alert('Rejected', 'User has been notified');
    } catch {
      Alert.alert('Error', 'Failed to notify user');
    }
  };

  const renderItem = ({ item }) => {
    const loan = item.id_loans || {};
    const cust = item.id_costumer || {};

    const loanOn = loan.loan_date
      ? new Date(loan.loan_date).toLocaleDateString()
      : '—';
    const returnOn = new Date(item.return_date).toLocaleDateString();

    // list the books
    const books = Array.isArray(loan.borrow_book)
      ? loan.borrow_book.map(b => b.book_id?.book_name || 'Unknown').join(', ')
      : 'No books';

    return (
      <View style={styles.card}>
        <Text style={styles.header}>Return Request</Text>
        <Text>Borrower: {cust.fullname}</Text>
        <Text>Loaned On: {loanOn}</Text>
        <Text>Returned On: {returnOn}</Text>
        <Text>Books: {books}</Text>
        <Text>Penalty: {item.penalty} VNĐ</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.approveBtn]}
            onPress={() => handleApprove(item)}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.rejectBtn]}
            onPress={() => handleReject(item)}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} size="large"/>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={r => r._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>No return requests</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex:1, backgroundColor:'#fff', padding:16 },
  card:       { borderWidth:1, borderColor:'#ddd', borderRadius:6, padding:12, marginBottom:12 },
  header:     { fontWeight:'bold', marginBottom:8 },
  actions:    { flexDirection:'row', justifyContent:'space-between', marginTop:12 },
  btn:        { flex:1, paddingVertical:8, borderRadius:4, alignItems:'center', marginHorizontal:4 },
  approveBtn: { backgroundColor:'#4CAF50' },
  rejectBtn:  { backgroundColor:'#F44336' },
  btnText:    { color:'#fff', fontWeight:'bold' },
  empty:      { textAlign:'center', marginTop:50, color:'#777' },
});
