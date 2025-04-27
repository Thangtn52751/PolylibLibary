import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

export default function EditProfileScreen({ navigation }) {
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    phone: '',
    address: '',
    avatar: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch(`http://10.0.2.2:3000/api/users/${userId}`);
      const data = await res.json();
      setForm({
        username: data.username,
        fullname: data.fullname,
        phone: data.phone,
        address: data.address,
        avatar: data.avatar,
      });
    };
    fetchData();
  }, []);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (res.assets && res.assets.length > 0) {
        const img = res.assets[0];
        setSelectedImage({ uri: img.uri, name: img.fileName, type: img.type });
      }
    });
  };

  const handleUpdate = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const formData = new FormData();

    formData.append('fullname', form.fullname);
    formData.append('phone', form.phone);
    formData.append('address', form.address);

    if (selectedImage) {
      formData.append('avatar', {
        uri: selectedImage.uri,
        name: selectedImage.name,
        type: selectedImage.type,
      });
    }

    try {
      const res = await fetch(`http://10.0.2.2:3000/api/users/${userId}`, {
        method: 'PUT',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = await res.json();
      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Update failed');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            selectedImage
              ? { uri: selectedImage.uri }
              : form.avatar
              ? { uri: `http://10.0.2.2:3000${form.avatar}` }
              : require('../img/logo.png')
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
      <TextInput
      style={styles.input}
      placeholder='Username'
      value={form.username}
      onChangeText={text => setForm({...form, username:text})}
      />

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.fullname}
        onChangeText={text => setForm({ ...form, fullname: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={form.phone}
        onChangeText={text => setForm({ ...form, phone: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={text => setForm({ ...form, address: text })}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 12,
  },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    alignSelf: 'center', marginBottom: 20,
    backgroundColor: '#eee',
  },
  button: {
    backgroundColor: '#d67e00',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});
