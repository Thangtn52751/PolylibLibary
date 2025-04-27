import React, { useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require('../img/background.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <Image source={require('../img/logo.png')} style={styles.logo} />
      <Text style={styles.title}>PolyLib</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
});
