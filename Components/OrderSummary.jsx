import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OrderSummary = ({ numOfItems, Subtotal, Discount, Delivery_Charges, total }) => {
  return (
    <View style={styles.summary_container}>
        <Text style={styles.head_summary}>Order Summary</Text>

        <View style={styles.row_summary}>
        <Text style={styles.body_summary}>Items</Text>
        <Text style={styles.body_summary}>{numOfItems}  </Text>
        </View>

        <View style={styles.row_summary}>
        <Text style={styles.body_summary}>Subtotal</Text>
        <Text style={styles.body_summary}>{Subtotal}  </Text>
        </View>

        <View style={styles.row_summary}>
        <Text style={styles.body_summary}>Discount</Text>
        <Text style={styles.body_summary}>-{Discount}%</Text>
        </View>

        <View style={styles.row_summary}>
        <Text style={styles.body_summary}>Delivery Charges</Text>
        <Text style={styles.body_summary}>{Delivery_Charges <= 0 ? "Free" : Delivery_Charges}</Text>
        </View>

        <View style={styles.separator}></View>

        <View style={styles.row_summary}>
        <Text style={styles.tail_summary}>Total</Text>
        <Text style={styles.tail_summary}>{total} EGP</Text>
        </View>

    </View>
  )
}

export default OrderSummary

const styles = StyleSheet.create({
    summary_container: {
        backgroundColor: "#f7f7f7",
        borderRadius: 10,
        margin:1,
    },
    head_summary: {
    fontSize: 15,
        fontWeight: "500",
        color: "#121212",
        marginTop:5,
        marginLeft: 5,
        marginBottom:2,
    },
    row_summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
    },
    body_summary: {
        fontSize: 12,
        marginTop:5,
        marginLeft: 5,
        marginRight: 5,
        color: "gray"
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    tail_summary: {
        fontSize: 15,
        fontWeight: "500",
        marginTop:0,
        marginLeft: 5,
        marginBottom:5,
        marginRight: 5,
        color: "#121212"
    },
})