import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

function Swiperr (){
  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        loop
        autoplayTimeout={3}
        showsPagination={true}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        paginationStyle={styles.pagination}
      >
        <Image source={require('../assets/icon.png')} style={styles.image} />
        <Image source={require('../assets/icon.png')} style={styles.image} />
        <Image source={require('../assets/icon.png')} style={styles.image} />
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
    width:"85%",
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width:"100%",
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
    marginHorizontal: "auto",
  },
  pagination: {
    bottom: 10,
  },
  dotStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDotStyle: {
    backgroundColor: '#0000ff',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
});

export default Swiperr;
