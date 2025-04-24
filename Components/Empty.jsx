import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

export default function Empty(props) {
  return (
    <View style={styles.noContainer}>
      <Text style={styles.noText}>{props.text ? props.text:"No Thing to show"}</Text>
      <Text style={styles.noSubtext}>{props.subText ? props.subText : "Add the product and try again"}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    noContainer: {
        backgroundColor: "#f8f9fa",
        width: "85%",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#eee",
      },
      noText: {
        fontSize: 16,
        color: "#555",
        fontWeight: "500",
        marginBottom: 4,
      },
      noSubtext: {
        fontSize: 14,
        color: "#999",
      },
})