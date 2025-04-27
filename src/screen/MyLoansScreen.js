import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, Alert, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyLoansScreen() {
  const [loans, setLoans]     = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyLoans = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      const res    = await fetch('http://10.0.2.2:3000/api/loans');
      const all    = await res.json();

      // only this user's
      let mine = all.filter(l => l.id_customer?._id === userId);

      // detect overdue
      const now = new Date();
      for (let loan of mine) {
        if (loan.status === 1 && new Date(loan.return_date) < now) {
          // call your PUT /api/loans/:id → { status: 2 }
          await fetch(`http://10.0.2.2:3000/api/loans/${loan._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ status: 2 })
          });
          // backend will auto‐create the “overdue” notification
          loan.status = 2;
        }
      }

      setLoans(mine);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not load your loans');
    }
    setLoading(false);
  };

  useEffect(() => { fetchMyLoans(); }, []);

  const renderLoan = ({ item }) => {
    const loanOn = new Date(item.loan_date).toLocaleDateString();
    const dueOn  = new Date(item.return_date).toLocaleDateString();
    let badgeLabel, badgeStyle;

    if (item.status === 0) {
      badgeLabel = 'Pending';  badgeStyle = styles.pending;
    } else if (item.status === 1) {
      badgeLabel = 'Active';   badgeStyle = styles.active;
    } else if (item.status === 2) {
      badgeLabel = 'Overdue';  badgeStyle = styles.overdue;
    } else {
      badgeLabel = 'Closed';   badgeStyle = styles.closed;
    }

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.loanLabel}>Loaned:</Text>
          <Text>{loanOn}</Text>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.loanLabel}>Due:</Text>
          <Text style={styles.dueDate}>{dueOn}</Text>
        </View>
        <View style={[styles.statusBadge, badgeStyle]}>
          <Text style={styles.statusText}>{badgeLabel}</Text>
        </View>
        {item.borrow_book.map((b,i) => (
          <View key={i} style={styles.bookRow}>
            {b.book_id?.image_url && (
              <Image source={{uri:b.book_id.image_url}} style={styles.bookImage} />
            )}
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>
                {b.book_id?.book_name || 'Unknown'}
              </Text>
              <Text style={styles.bookQty}>Qty: {b.quantity}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (!loans.length) return <Text style={styles.empty}>You have no current loans.</Text>;

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={loans}
      keyExtractor={l=>l._id}
      renderItem={renderLoan}
    />
  );
}

const styles = StyleSheet.create({
  list:    { padding:16, backgroundColor:'#fff' },
  loader:  { flex:1, justifyContent:'center', marginTop:50 },
  empty:   { textAlign:'center', marginTop:50, color:'#777', fontSize:16 },
  card:    { borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:16, marginBottom:16, backgroundColor:'#fafafa' },
  headerRow:{ flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
  loanLabel:{ fontWeight:'bold' },
  dueDate: { color:'#d67e00', fontWeight:'600' },
  statusBadge:{ alignSelf:'flex-start', paddingHorizontal:8, paddingVertical:4, borderRadius:12, marginBottom:12 },
  pending: { backgroundColor:'#FFA500' },
  active:  { backgroundColor:'#4CAF50' },
  overdue: { backgroundColor:'#F44336' },
  closed:  { backgroundColor:'#888' },
  statusText:{ color:'#fff', fontWeight:'bold' },
  bookRow:{ flexDirection:'row', alignItems:'center', marginTop:12 },
  bookImage:{ width:60, height:60, borderRadius:4, marginRight:12, backgroundColor:'#eee' },
  bookInfo:{ flex:1 },
  bookTitle:{ fontWeight:'bold', marginBottom:4 },
  bookQty:{ color:'#555' },
});