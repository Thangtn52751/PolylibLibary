// src/screens/UserLoansScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';

export default function UserLoansScreen({ route, navigation }) {
  const { userId, fullname } = route.params;
  const [loans, setLoans]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async ()=>{
      setLoading(true);
      try {
        const res  = await fetch(`http://10.0.2.2:3000/api/loans/user/${userId}`);
        const data = await res.json();
        setLoans(data);
      } catch {
        Alert.alert('Error','Could not load loans');
      }
      setLoading(false);
    })();
  }, [userId]);

  const renderItem = ({ item }) => {
    const loanDate = new Date(item.loan_date).toLocaleDateString();
    const dueDate  = item.return_date
      ? new Date(item.return_date).toLocaleDateString()
      : 'Not set';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={()=> navigation.navigate('RemindLoan', {
          loanId: item._id,
          fullname,
          dueDate
        })}
      >
        <Text style={styles.title}>Loan on {loanDate}</Text>
        <Text>Due: {dueDate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Loans for {fullname}</Text>
      {loading
        ? <ActivityIndicator style={{marginTop:20}}/>
        : <FlatList
            data={loans}
            keyExtractor={l=>l._id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.empty}>No loans</Text>}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff',padding:16},
  header:{fontSize:18,fontWeight:'bold',marginBottom:12},
  card:{
    padding:12,
    borderWidth:1, borderColor:'#ddd',
    borderRadius:6, marginBottom:12
  },
  title:{fontWeight:'bold',marginBottom:4},
  empty:{marginTop:50,textAlign:'center',color:'#777'}
});
