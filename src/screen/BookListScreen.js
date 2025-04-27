// src/screens/BookListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BookListScreen({ navigation }) {
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadBooks);
    return unsub;
  }, [navigation]);

  async function loadBooks() {
    setLoading(true);
    try {
      const res  = await fetch('http://10.0.2.2:3000/api/books');
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      // you could Alert here
    }
    setLoading(false);
  }

  const renderItem = ({ item }) => {
    const uri = item.image_url
      ? item.image_url
      : 'https://via.placeholder.com/80x120?text=No+Image';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EditBook', { bookId: item._id })}
      >
        <Image source={{ uri }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.book_name}</Text>
          <Text style={styles.auth}>{item.auth}</Text>
          <Text style={styles.price}>{item.loan_price} VNĐ</Text>
        </View>
        {item.status==='new' && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading
        ? <ActivityIndicator style={{ marginTop:20 }} />
        : <>
            <FlatList
              data={books}
              keyExtractor={b => b._id}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={styles.sep}/>}
              ListEmptyComponent={
                <Text style={styles.empty}>No books found</Text>
              }
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('AddBook')}
            >
              <Text style={styles.addTxt}>+ Add Book</Text>
            </TouchableOpacity>
          </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff',padding:12},
  card:{
    flexDirection:'row',
    alignItems:'center',
    padding:12,
    backgroundColor:'#fafafa',
    borderRadius:6,
    position:'relative'
  },
  image:{width:80,height:120,backgroundColor:'#eee',borderRadius:4},
  info:{flex:1,marginLeft:12},
  name:{fontSize:16,fontWeight:'bold'},
  auth:{color:'#555',marginTop:4},
  price:{color:'#d67e00',marginTop:4},
  badge:{
    position:'absolute',top:8,right:32,
    backgroundColor:'#d67e00',
    paddingHorizontal:6,paddingVertical:2,
    borderRadius:4
  },
  badgeText:{color:'#fff',fontSize:10,fontWeight:'bold'},
  sep:{height:1,backgroundColor:'#eee',marginVertical:8},
  empty:{textAlign:'center',marginTop:50,color:'#777'},
  addBtn:{
    position:'absolute',
    right:16,
    bottom:16,
    backgroundColor:'#d67e00',
    paddingVertical:12,
    paddingHorizontal:20,
    borderRadius:30,
    elevation:3
  },
  addTxt:{color:'#fff',fontSize:16,fontWeight:'bold'}
});
