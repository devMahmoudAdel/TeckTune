import React, { useState } from "react";
import { 
  View, 
  StyleSheet, 
  Image, 
  Dimensions,
  FlatList 
} from "react-native";

const { width } = Dimensions.get('window');

export default function TopsectionPD(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <Image source={item} style={styles.image} resizeMode="contain" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={props.images || []}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const slideIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(slideIndex);
        }}
        keyExtractor={(_, index) => index.toString()}
      />
      
      <View style={styles.pagination}>
        {(props.images || []).map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex ? styles.paginationDotActive : {}
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
    position: 'relative',
  },
  imageContainer: {
    width: width,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
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
