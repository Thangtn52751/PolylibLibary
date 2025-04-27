// src/screens/BookEditScreen.js

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert, Image, ActivityIndicator
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function BookEditScreen({ route, navigation }) {
  const { bookId } = route.params;

  const [types, setTypes]       = useState([]);
  const [book, setBook]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [pickedImage, setPickedImage] = useState(null);

  useEffect(() => {
    Promise.all([fetchTypes(), fetchBook()]).finally(() => setLoading(false));
  }, []);

  async function fetchTypes() {
    try {
      const res  = await fetch('http://10.0.2.2:3000/api/bookTypes');
      const data = await res.json();
      setTypes(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error','Could not load book types');
    }
  }

  async function fetchBook() {
    try {
      const res  = await fetch(`http://10.0.2.2:3000/api/books/${bookId}`);
      const data = await res.json();
      setBook({
        book_name: data.book_name,
        auth:      data.auth,
        publisher: data.publisher,
        des:       data.des || '',
        loan_price:data.loan_price,
        quantity:  String(data.quantity),
        book_type: data.book_type?._id,
        status:    data.status || 'new',
        image_url: data.image_url,
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error','Could not load book');
    }
  }

  function pickImage() {
    launchImageLibrary({ mediaType:'photo' }, ({ assets }) => {
      if (assets?.length) setPickedImage(assets[0]);
    });
  }

  async function save() {
    // simple validation
    if (!book.book_name.trim() ||
        !book.auth.trim() ||
        !book.publisher.trim() ||
        !book.loan_price.trim() ||
        !book.quantity.trim() ||
        !book.book_type
    ) {
      return Alert.alert('Validation','Please fill all required fields');
    }

    setSaving(true);
    const form = new FormData();
    form.append('book_name',  book.book_name);
    form.append('auth',       book.auth);
    form.append('publisher',  book.publisher);
    form.append('des',        book.des);
    form.append('loan_price', book.loan_price);
    form.append('quantity',   book.quantity);
    form.append('book_type',  book.book_type);
    form.append('status',     book.status);
    // keep existing URL if no new image
    if (pickedImage) {
      form.append('image', {
        uri:  pickedImage.uri,
        name: pickedImage.fileName || 'photo.jpg',
        type: pickedImage.type || 'image/jpeg'
      });
    } else if (book.image_url) {
      // backend expects image_url field if not replaced
      form.append('image_url', book.image_url);
    }

    try {
      const res = await fetch(`http://10.0.2.2:3000/api/books/${bookId}`, {
        method:  'PUT',
        headers: { 'Content-Type':'multipart/form-data' },
        body:    form
      });
      if (!res.ok) throw new Error('Server error');
      Alert.alert('Success','Book updated');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error','Could not update book');
    }
    setSaving(false);
  }

  if (loading || !book) {
    return <ActivityIndicator style={{ flex:1, justifyContent:'center' }} size="large" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Book Name*</Text>
      <TextInput
        style={styles.input}
        value={book.book_name}
        onChangeText={t => setBook(b => ({ ...b, book_name: t }))}
      />

      <Text style={styles.label}>Author*</Text>
      <TextInput
        style={styles.input}
        value={book.auth}
        onChangeText={t => setBook(b => ({ ...b, auth: t }))}
      />

      <Text style={styles.label}>Publisher*</Text>
      <TextInput
        style={styles.input}
        value={book.publisher}
        onChangeText={t => setBook(b => ({ ...b, publisher: t }))}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height:80 }]}
        multiline
        value={book.des}
        onChangeText={t => setBook(b => ({ ...b, des: t }))}
      />

      <Text style={styles.label}>Loan Price (VNĐ)*</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(book.loan_price)}
        onChangeText={t => setBook(b => ({ ...b, loan_price: t }))}
      />

      <Text style={styles.label}>Quantity*</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={book.quantity}
        onChangeText={t => setBook(b => ({ ...b, quantity: t }))}
      />

      <Text style={styles.label}>Type*</Text>
      {types.map(t => (
        <TouchableOpacity
          key={t._id}
          style={[
            styles.typeBtn,
            book.book_type === t._id && styles.typeBtnActive
          ]}
          onPress={() => setBook(b => ({ ...b, book_type: t._id }))}
        >
          <Text style={[
            styles.typeText,
            book.book_type === t._id && styles.typeTextActive
          ]}>
            {t.type}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Status*</Text>
      {['new','old'].map(s => (
        <TouchableOpacity
          key={s}
          style={[
            styles.typeBtn,
            book.status === s && styles.typeBtnActive
          ]}
          onPress={() => setBook(b => ({ ...b, status: s }))}
        >
          <Text style={[
            styles.typeText,
            book.status === s && styles.typeTextActive
          ]}>
            {s.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Cover Image</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {pickedImage
          ? <Image source={{ uri:pickedImage.uri }} style={styles.preview}/>
          : book.image_url
            ? <Image source={{ uri:book.image_url }} style={styles.preview}/>
            : <Text>Select an image…</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={save}
        disabled={saving}
      >
        {saving
          ? <ActivityIndicator color="#fff"/>
          : <Text style={styles.saveTxt}>Save Changes</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, backgroundColor:'#fff' },
  label:{ marginTop:16, fontWeight:'bold', fontSize:14 },
  input:{
    borderWidth:1, borderColor:'#ccc',
    borderRadius:6, padding:8, marginTop:4
  },
  typeBtn:{
    marginTop:6,
    padding:8,
    borderWidth:1,
    borderColor:'#ccc',
    borderRadius:6
  },
  typeBtnActive:{
    backgroundColor:'#d67e00',
    borderColor:'#d67e00'
  },
  typeText:{ color:'#333' },
  typeTextActive:{ color:'#fff', fontWeight:'bold' },
  imagePicker:{
    height:150,
    backgroundColor:'#f0f0f0',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:6,
    marginTop:6
  },
  preview:{
    width:'100%',
    height:'100%',
    borderRadius:6
  },
  saveBtn:{
    backgroundColor:'#d67e00',
    padding:14,
    marginTop:24,
    borderRadius:6,
    alignItems:'center'
  },
  saveTxt:{ color:'#fff', fontWeight:'bold', fontSize:16 }
});
