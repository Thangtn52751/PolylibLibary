// src/screen/BookRegScreenEmployee.js

import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, Image, ActivityIndicator,
  Modal, TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS = {
  ALL: 'all',
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2
};

export default function BookRegScreenEmployee() {
  const [requests, setRequests]       = useState([]);
  const [filter, setFilter]           = useState(STATUS.ALL);
  const [loading, setLoading]         = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType]       = useState(null); // 'approve' | 'reject'
  const [currentId, setCurrentId]       = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res  = await fetch('http://10.0.2.2:3000/api/regbooks');
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      Alert.alert('Error','Could not load registration requests');
    }
    setLoading(false);
  }

  // this will be used for both approve & reject
  async function performUpdate(status) {
    const employeeId = await AsyncStorage.getItem('userId');
    const body = { id_employee: employeeId, status };

    if (status === STATUS.APPROVED) {
      // optional: pass a return date a week out
      body.return_date = new Date(Date.now() + 7*24*60*60*1000).toISOString();
    }
    if (status === STATUS.REJECTED) {
      body.note = rejectReason.trim();
    }

    try {
      await fetch(`http://10.0.2.2:3000/api/regbooks/${currentId}`, {
        method:  'PUT',
        headers: { 'Content-Type':'application/json' },
        body:    JSON.stringify(body)
      });
      setModalVisible(false);
      setRejectReason('');
      fetchRequests();
    } catch {
      Alert.alert('Error','Could not update status');
    }
  }

  function onApprovePress(id) {
    setCurrentId(id);
    setModalType('approve');
    setModalVisible(true);
  }

  function onRejectPress(id) {
    setCurrentId(id);
    setModalType('reject');
    setRejectReason('');
    setModalVisible(true);
  }

  const filtered = requests.filter(r => {
    if (filter === STATUS.ALL) return true;
    return r.status === filter;
  });

  function renderItem({ item }) {
    const firstLoan = Array.isArray(item.loan_bookid) && item.loan_bookid[0];
    const book      = firstLoan && firstLoan.book_id;
    const title     = book?.book_name || 'Unknown Book';
    const imgUri    = book?.image_url
      ? book.image_url
      : 'https://via.placeholder.com/100x100?text=No+Image';
    const requester = item.id_customer?.fullname || 'Unknown';

    const statusMap = {
      [STATUS.PENDING]:   { label:'Pending',  style:styles.pending },
      [STATUS.APPROVED]:  { label:'Approved', style:styles.approved },
      [STATUS.REJECTED]:  { label:'Rejected', style:styles.rejected },
    };
    const { label, style } = statusMap[item.status] || statusMap[STATUS.PENDING];

    return (
      <View style={styles.card}>
        <Image source={{ uri: imgUri }} style={styles.bookImage} />
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>By: {requester}</Text>
          <Text style={[styles.status, style]}>{label}</Text>
          <Text style={styles.note}>
            “{item.note?.trim() || 'No note provided'}”
          </Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>

          {item.status === STATUS.PENDING && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.approveBtn]}
                onPress={() => onApprovePress(item._id)}
              >
                <Text style={styles.btnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.rejectBtn]}
                onPress={() => onRejectPress(item._id)}
              >
                <Text style={styles.btnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <View style={styles.filterRow}>
        {[
          { key: STATUS.ALL,      label: 'All' },
          { key: STATUS.PENDING,  label: 'Pending' },
          { key: STATUS.APPROVED, label: 'Approved' },
          { key: STATUS.REJECTED, label: 'Rejected' }
        ].map(btn=>(
          <TouchableOpacity
            key={btn.key}
            style={[
              styles.filterBtn,
              filter===btn.key && styles.filterBtnActive
            ]}
            onPress={()=>setFilter(btn.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter===btn.key && styles.filterTextActive
              ]}
            >
              {btn.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading
        ? <ActivityIndicator style={{marginTop:20}}/>
        : <FlatList
            data={filtered}
            keyExtractor={i=>i._id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>No registration requests</Text>
            }
          />
      }

      <Modal
        visible={modalVisible}
        transparent animationType="fade"
        onRequestClose={()=>setModalVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            {modalType === 'approve' ? (
              <>
                <Text style={styles.modalTitle}>Confirm Approval?</Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={()=>setModalVisible(false)}
                  >
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.approveBtn]}
                    onPress={()=>performUpdate(STATUS.APPROVED)}
                  >
                    <Text style={styles.btnText}>Yes, Approve</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Rejection Reason</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter reason for rejection"
                  value={rejectReason}
                  onChangeText={setRejectReason}
                />
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.rejectBtn]}
                    onPress={()=>setModalVisible(false)}
                  >
                    <Text style={styles.btnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, styles.approveBtn]}
                    onPress={()=>{
                      if (!rejectReason.trim()) {
                        return Alert.alert('Please enter a reason');
                      }
                      performUpdate(STATUS.REJECTED);
                    }}
                  >
                    <Text style={styles.btnText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },

  filterRow: {
    flexDirection:'row',
    justifyContent:'space-around',
    paddingVertical:12,
    borderBottomWidth:1,
    borderColor:'#eee'
  },
  filterBtn: {
    paddingVertical:6,
    paddingHorizontal:12,
    borderRadius:20,
    backgroundColor:'#f0f0f0'
  },
  filterBtnActive: { backgroundColor:'#d67e00' },
  filterText:      { color:'#333' },
  filterTextActive:{ color:'#fff', fontWeight:'bold' },

  card: {
    flexDirection:'row',
    borderWidth:1,
    borderColor:'#ddd',
    borderRadius:6,
    margin:12,
    padding:10,
    overflow:'hidden'
  },
  bookImage: { width:120, height:120, marginTop:10},
  info:      { flex:1, padding:8 },

  title: { fontWeight:'bold', marginBottom:4, fontSize:17 },
  sub:   { fontStyle:'italic', marginBottom:4 },

  status:       { fontWeight:'bold', marginBottom:4 },
  pending:      { color:'#FFA500' },
  approved:     { color:'#4CAF50' },
  rejected:     { color:'#F44336' },

  note:         { marginBottom:4, color:'#555' },
  date:         { fontSize:12, color:'#888' },

  actions:      { flexDirection:'row', marginTop:8 },
  btn:          {
    flex:1,
    paddingVertical:8,
    borderRadius:4,
    alignItems:'center',
    marginHorizontal:4
  },
  approveBtn:   { backgroundColor:'#4CAF50' },
  rejectBtn:    { backgroundColor:'#F44336' },
  btnText:      { color:'#fff', fontWeight:'bold' },

  empty: { textAlign:'center', marginTop:50, color:'#777' },

  backdrop:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.4)',
    justifyContent:'center',
    alignItems:'center'
  },
  modal:{
    width:'80%',
    backgroundColor:'#fff',
    borderRadius:8,
    padding:16
  },
  modalTitle: { fontSize:18, fontWeight:'bold', marginBottom:12 },
  modalInput:{
    borderWidth:1, borderColor:'#ccc',
    borderRadius:6, padding:10,
    marginBottom:16
  },
  modalActions:{
    flexDirection:'row',
    justifyContent:'flex-end'
  }
});
