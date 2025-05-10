import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');

export default function NoInternet() {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline" size={width*0.5} color="black" style={styles.image} />
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Please check your internet connection and try again.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.1,
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: width > 400 ? 22 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width > 400 ? 16 : 14,
    color: '#666',
    textAlign: 'center',
  },
});