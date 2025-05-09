import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Alert  } from 'react-native'
import React, { useState } from 'react';
import Order_Summary from '../../Components/OrderSummary'
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/useAuth';
const Checkout = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [isChecked, setIsChecked] = useState(false);
    const { subtotal, discount, delivery, count, total } = useLocalSearchParams();
  return (
    <View style={{flex:1, backgroundColor:"#fff", padding:10}}>
        <View
                style={[styles.header, { marginTop: StatusBar.currentHeight  }]}
              >
                <Entypo
                  name="chevron-left"
                  size={24}
                  color="black"
                  onPress={() => router.back()}
                />
                <Text style={styles.textHeader}>Checkout</Text>
              </View>
        <View style={{marginTop:25}}>
            <View style={styles.info_delivery_container}>
                <View style={styles.info_delivery_icon}>
                    <MaterialIcons name="location-on" size={24} color="#5f55da" />
                </View>
                <View>
                    <Text style={styles.info_delivery_text1}>325 12th Essadat, October</Text>
                    <Text style={styles.info_delivery_text2}>Cairo University in Test</Text>
                </View>
            </View>
            <View style={styles.info_delivery_container}>
                <View style={styles.info_delivery_icon}>
                    <MaterialIcons name="access-time" size={24} color="#5f55da" />
                </View>
                <View>
                    <Text style={styles.info_delivery_text1}>Expected Delivery</Text>
                    <Text style={styles.info_delivery_text2}>Tomorrow, 8:00 PM - 10:00 PM</Text>
                </View>
            </View>
        </View>
        

        <Order_Summary
            numOfItems={count}
            Subtotal={subtotal}
            Discount={discount}
            Delivery_Charges={delivery}
            total={total}
        />

        <View style={{margin:10}}>
            <Text style={styles.payment_head}>Choose payment method</Text>
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsChecked(!isChecked)}
            >
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                    <MaterialIcons name="local-shipping" size={18} color="#5f55da" />
                    <Text style={styles.label}>Cash on delivery</Text>
                </View>
                <View style={[styles.checkbox, isChecked && styles.checkedBox]} />
            </TouchableOpacity>
        </View>

        <TouchableOpacity
            style = {[styles.btn_confirm, isChecked && styles.btn_confirmed ]}
            onPress={() =>{ if(isChecked) Alert.alert("🎉 Congratulations")}}
        >
            <Text style={{color:'white', fontSize:16}}>Confirm</Text>

        </TouchableOpacity>


    </View>
  )
}

export default Checkout

const styles = StyleSheet.create({
    info_delivery_container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginHorizontal: 5,
        marginBottom:15,
    },
    info_delivery_icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eefafd',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:10
    },
    info_delivery_text1:{
        fontSize:16,
        color: "#121212"
    },
    info_delivery_text2: {
        fontSize:12,
        color: "gray",

    },
    payment_head: {
        fontSize:15,
        color: "#121212",
        fontWeight:"500",
        marginTop: 25,
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 7,
        marginHorizontal:5,
        alignItems: 'center'
    },

    checkbox: {
        width: 15,
        height: 15,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        marginRight: 8,
        backgroundColor: 'white',
    },

    checkedBox: {
        backgroundColor: '#5f55da',
        borderColor: 'black',
    },

    label: {
        fontSize: 14,
        color: 'gray',
    },
    btn_confirm:{
        marginTop:40,
        marginHorizontal:10,
        padding:7,
        borderRadius:5,
        backgroundColor: "gray",
        alignItems: 'center',
        color: 'white',
        position: 'absolute', 
        bottom: 20,
        left: 10, 
        right: 10,
    },
    btn_confirmed:{
        backgroundColor: "#5f55da",
    },
    header: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "92%",
    alignItems: "center",
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: 20,
  },



})