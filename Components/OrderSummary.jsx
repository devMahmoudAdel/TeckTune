import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';

const screen = Dimensions.get('window');

const OrderSummary = ({ numOfItems, Subtotal, Discount, Delivery_Charges, total }) => {
  return (
    <View style={styles.summary_container}>
      <Text style={styles.head_summary}>Order Summary</Text>

      <View style={styles.row_summary}>
        <Text style={styles.body_summary}>Items</Text>
        <Text style={styles.body_summary}>{numOfItems}</Text>
      </View>

      <View style={styles.row_summary}>
        <Text style={styles.body_summary}>Subtotal</Text>
        <Text style={styles.body_summary}>{Subtotal}</Text>
      </View>

      <View style={styles.row_summary}>
        <Text style={styles.body_summary}>Discount</Text>
        <Text style={styles.body_summary}>-{Discount}%</Text>
      </View>

      <View style={styles.row_summary}>
        <Text style={styles.body_summary}>Delivery Charges</Text>
        <Text style={styles.body_summary}>
          {Delivery_Charges <= 0 ? 'Free' : Delivery_Charges}
        </Text>
      </View>

      <View style={styles.separator}></View>

      <View style={styles.row_summary}>
        <Text style={styles.tail_summary}>Total</Text>
        <Text style={styles.tail_summary}>{total} EGP</Text>
      </View>
    </View>
  );
};

export default OrderSummary;

const styles = StyleSheet.create({
  summary_container: {
    backgroundColor: '#f7f7f7',
    borderRadius: screen.width * 0.03,
    margin: screen.width * 0.02,
    padding: screen.width * 0.04,
    width: screen.width * 0.9,
  },
  head_summary: {
    fontSize: screen.width * 0.045,
    fontWeight: '500',
    color: '#121212',
    marginBottom: screen.height * 0.01,
  },
  row_summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: screen.height * 0.005,
  },
  body_summary: {
    fontSize: screen.width * 0.04,
    color: 'gray',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: screen.height * 0.02,
  },
  tail_summary: {
    fontSize: screen.width * 0.045,
    fontWeight: '500',
    color: '#121212',
  },
});