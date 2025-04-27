// src/components/Banner.js
import React, { useRef, useEffect } from 'react';
import { View, Animated, Image, Dimensions, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

export default function Banner() {
  const images = [
    require('../img/banner1.jpg'),
    require('../img/banner2.jpg'),
    require('../img/banner3.jpg'),
  ];

  // Create one Animated.Value for opacity+scale per slide
  const animValues = images.map(() => ({
    opacity: useRef(new Animated.Value(0.6)).current,
    scale: useRef(new Animated.Value(0.9)).current,
  }));

  // On mount, animate the first slide to full
  useEffect(() => {
    Animated.parallel([
      Animated.timing(animValues[0].opacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(animValues[0].scale, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleIndexChanged = (idx) => {
    animValues.forEach(({ opacity, scale }, i) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: i === idx ? 1 : 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: i === idx ? 1 : 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <View style={styles.wrapper}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        loop
        onIndexChanged={handleIndexChanged}
        showsPagination
        paginationStyle={styles.pagination}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {images.map((src, i) => (
          <Animated.View
            key={i}
            style={[
              styles.slide,
              {
                opacity: animValues[i].opacity,
                transform: [{ scale: animValues[i].scale }],
              },
            ]}
          >
            <Image source={src} style={styles.image} />
          </Animated.View>
        ))}
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: 180, marginBottom: 16 },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width - 32,
    height: 180,
    borderRadius: 12,
  },
  pagination: { bottom: 8 },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#d67e00',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
});
