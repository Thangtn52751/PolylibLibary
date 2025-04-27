// src/screens/UserListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Image
} from 'react-native';

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async ()=>{
      setLoading(true);
      try {
        const res  = await fetch('http://10.0.2.2:3000/api/users');
        const data = await res.json();
        const onlyCustomers = data.filter(u=> u.role===0);
        setUsers(onlyCustomers);
      } catch {
        Alert.alert('Error','Could not load users');
      }
      setLoading(false);
    })();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={()=>
        
         navigation.navigate('UserLoans', {
        userId: item._id,
        fullname: item.fullname
      })}
    >
      <Image
        source={ item.avatar
          ? { uri:`http://10.0.2.2:3000${item.avatar}` }
          : require('../img/logo.png')
        }
        style={styles.avatar}
      />
      <View style={styles.meta}>
        <Text style={styles.name}>{item.fullname}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <Text style={styles.header}>Customer List</Text>

      {loading
        ? <ActivityIndicator style={{marginTop:20}}/>
        : <FlatList
            data={users}
            keyExtractor={u=>u._id}
            renderItem={renderItem}
            ItemSeparatorComponent={()=> <View style={styles.sep}/>}
            ListEmptyComponent={<Text style={styles.empty}>No customers</Text>}
          />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff', padding:16},
  row:{flexDirection:'row',padding:12,alignItems:'center', borderWidth:0.5, marginBottom:10, borderRadius:10, color:'gray', shadowColor:'black', shadowOffset:0.5},
  avatar:{width:50,height:50,borderRadius:25,backgroundColor:'#eee'},
  meta:{marginLeft:12},
  name:{fontSize:16,fontWeight:'500'},
  email:{color:'#555',marginTop:4},
  sep:{height:1,backgroundColor:'#eee',marginHorizontal:12},
  empty:{marginTop:50,textAlign:'center',color:'#999'},
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    color: '#d67e00'
  },

});
