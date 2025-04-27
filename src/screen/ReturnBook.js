import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ReturnBook() {
  const [loans, setLoans]     = useState([]);
  const [loading, setLoading] = useState(false);

  // 1) load only this user’s active loans
  const fetchLoans = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res    = await fetch('http://10.0.2.2:3000/api/loans');
      const all    = await res.json();
      // keep only loans belonging to me
      setLoans(all.filter(l => l.id_customer?._id === userId));
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load your loans');
    }
    setLoading(false);
  };

  useEffect(() => { fetchLoans(); }, []);

  // 2) send a return‐request
  const sendReturnRequest = async (loan) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const resp = await fetch('http://10.0.2.2:3000/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_loans:    loan._id,
          return_date: new Date().toISOString(),
          penalty:     0,
          id_costumer: userId,
          // we temporarily set id_employee to userId so that
          // the schema requirement is satisfied; staff will
          // overwrite it when they approve.
          id_employee: userId
        })
      });
      if (!resp.ok) throw new Error('Server rejected request');
      Alert.alert('Success', 'Return request submitted');
      fetchLoans();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not submit return request');
    }
  };

  // 3) render each loan (with book names)
  const renderLoan = ({ item }) => {
    const loanOn = new Date(item.loan_date).toLocaleDateString();
    const dueOn  = new Date(item.return_date).toLocaleDateString();
    return (
      <View style={styles.card}>
        <Text><Text style={styles.bold}>Loaned:</Text> {loanOn}</Text>
        <Text><Text style={styles.bold}>Due:</Text> {dueOn}</Text>

        {Array.isArray(item.borrow_book) && item.borrow_book.map((b, i) => (
          <Text key={i}>• {b.book_id?.book_name || 'Unknown'} ×{b.quantity}</Text>
        ))}

        <TouchableOpacity
          style={styles.button}
          onPress={() => sendReturnRequest(item)}
        >
          <Text style={styles.buttonText}>Request Return</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large"/>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={loans}
        keyExtractor={l => l._id}
        renderItem={renderLoan}
        ListEmptyComponent={
          <Text style={styles.empty}>You have no active loans.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff', padding:16 },
  card: {
    borderWidth: 1, borderColor: '#ddd',
    borderRadius: 6, padding: 12, marginBottom: 12
  },
  bold:        { fontWeight: 'bold' },
  button:      {
    marginTop: 12,
    backgroundColor: '#d67e00',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText:  { color:'#fff', fontWeight:'bold' },
  empty:       { textAlign:'center', marginTop:50, color:'#777' },
});
