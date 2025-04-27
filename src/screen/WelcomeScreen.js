import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const WelcomeScreen = ({navigation}) => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
        <Image
            source={require('../img/logo.png')} // ảnh thư viện
           style={styles.logo}
        />
        <Text
            style={styles.title}>
            Welcome To PolyLib
        </Text>
        <Text style={styles.subtitle}>We welcome you to Polylib libary!</Text>
        <Image
            source={require('../img/books.png')}
            style={styles.boooksimg}
            resizeMode="cover"
        />
        <Text
        style={styles.subtitle2}>
            We are glad to have you here.A lot of books are waiting for you to explore. 
            We hope you have a great time reading and learning.
            Happy reading!
        </Text>
        <TouchableOpacity
        style={styles.btnBackGround}
        onPress={() => navigation.navigate('SignUp')}
        >
           <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>

        <View style={styles.navigationRegister}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() =>navigation.navigate('Login')}>
          <Text style={{ color: '#DB8606', fontWeight: 'bold' }}> Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        marginTop:150,
      },
    title: {
        color: 'black',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20,
      },
    subtitle: {
        color: 'black',
        fontSize: 15,
        marginTop: 10,
      },
    boooksimg: {
        marginTop:50,
      },
    subtitle2: {
        color: 'black',
        fontSize: 15,
        marginTop: 20,
        marginHorizontal: 20,
        textAlign: 'center',
      },
    btnBackGround: {
        backgroundColor: '#DB8606',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        marginTop: 50,
        width: 400,
        alignItems: 'center',
      },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
      navigationRegister: {
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
      },
    
})