import { View,ActivityIndicator,StyleSheet } from 'react-native'
import React from 'react'

export default function Loading() {
  return (
    <View style={styles.container}>
            <ActivityIndicator size="large" color="#5A31F4" />
          </View>
  )
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:"center",
        alignItems: "center",
        backgroundColor: "#fff",
    }
})