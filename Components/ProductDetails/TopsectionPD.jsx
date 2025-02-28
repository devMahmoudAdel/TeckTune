

import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  Dimensions, 
  FlatList 
} from "react-native";

const { width } = Dimensions.get('window');

export default function ImageSlider({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={item} style={styles.image} resizeMode="cover" />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={200}
        keyExtractor={(_, index) => index.toString()}
      />

      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.paginationDot, 
              index === activeIndex && styles.paginationDotActive
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 300,
    width: '100%',
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  paginationDotActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});
