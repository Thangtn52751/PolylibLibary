import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/api/books')
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setFiltered(data);
      })
      .catch(err => console.error('Error loading books:', err));
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const result = books.filter(book =>
      book.book_name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(result);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('BookDetail', { bookId: item._id })}
    >
      <Icon name="book-outline" size={20} />
      <Text style={styles.itemText}>{item.book_name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>

      <View style={styles.searchBox}>
        <Icon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search For Books"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      <Text style={styles.section}>Trending</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20
  },
  searchIcon: { marginRight: 8 },
  input: { flex: 1 },
  section: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  itemText: { marginLeft: 10, fontSize: 16 },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 5
  }
});
