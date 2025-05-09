import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');
const data = [
  { id: 1, image: require('../assets/banner/banner1.png') },
  { id: 2, image: require('../assets/banner/banner2.png') },
  { id: 3, image: require('../assets/banner/banner3.png') },]
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
        {data.map((item) => (<Image key={item.id} source={item.image} style={styles.image} />))} 
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    // width:"85%",
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width:"100%",
    height: 150,
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
