import { StyleSheet, Text, View, StatusBar, Pressable, TouchableOpacity, Alert, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import Order_Summary from '../../Components/OrderSummary';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/useAuth';
import { getCart } from '../../firebase/Cart';
import { addOrder } from '../../firebase/Order';
import { getUser } from '../../firebase/User';
import Loading from '../../Components/Loading';
import { updateProductRecommendation } from '../../firebase/Product';

const screen = Dimensions.get('window');

const Checkout = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isChecked, setIsChecked] = useState(false);
  const { subtotal, discount, delivery, count, total } = useLocalSearchParams();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    const userData = await getUser(user.id);
    setUserData(userData);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleConfirm = async () => {
    const cart = await getCart();
    if (cart.length === 0) {
      Alert.alert("Your cart is empty");
      return;
    }
    const products = cart.map((item) => ({
      id: item.id,
      name: item.title,
      image: item.images[0],
      price: item.price,
      quantity: item.quantity,
    }));
    const orderData = {
      products: products,
      address: userData.address,
      payment_method: selectedPayment,
      user_name: user.username,
      user_id: user.id,
    };
    const productIds = products.map(p => p.id);
    await updateProductRecommendation(productIds);
    const orderId = await addOrder(orderData);
    if (orderId) {
      Alert.alert("Order placed successfully", `Your order ID is ${orderId}`);
      router.push("../(main)/(tabs)/Home");
    } else {
      Alert.alert("Error placing order", "Please try again later");
    }
  };

  const handleCheckBox = (value) => {
    if (isChecked && selectedPayment === value) {
      setIsChecked(false);
      setSelectedPayment("");
    } else {
      setIsChecked(true);
      setSelectedPayment(value);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { marginTop: StatusBar.currentHeight }]}>
        <Entypo
          name="chevron-left"
          size={24}
          color="black"
          onPress={() => router.back()}
        />
        <Text style={styles.textHeader}>Checkout</Text>
      </View>
      <View style={styles.deliverySection}>
        {(user.address || userData.address) ? (
          <View style={styles.infoDeliveryContainer}>
            <View style={styles.infoDeliveryIcon}>
              <MaterialIcons name="location-on" size={24} color="#5f55da" />
            </View>
            <Text style={styles.infoDeliveryText1}>{user.address || userData.address}</Text>
          </View>
        ) : (
          <View style={styles.infoDeliveryContainer}>
            <View style={styles.infoDeliveryIcon}>
              <MaterialIcons name="location-on" size={24} color="#5f55da" />
            </View>
            <View style={styles.noAddressContainer}>
              <Text style={styles.infoDeliveryText1}>No address found</Text>
              <Pressable
                style={styles.addAddressButton}
                onPress={() => router.push("../(main)/(tabs)/Profile/MyProfile")}
              >
                <Text style={styles.addAddressText}>Add address</Text>
              </Pressable>
            </View>
          </View>
        )}
        <View style={styles.infoDeliveryContainer}>
          <View style={styles.infoDeliveryIcon}>
            <MaterialIcons name="access-time" size={24} color="#5f55da" />
          </View>
          <View>
            <Text style={styles.infoDeliveryText1}>Expected Delivery</Text>
            <Text style={styles.infoDeliveryText2}>Tomorrow, 8:00 PM - 10:00 PM</Text>
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

      <View style={styles.paymentSection}>
        <Text style={styles.paymentHead}>Choose payment method</Text>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleCheckBox("cash")}
        >
          <View style={styles.checkboxRow}>
            <MaterialIcons name="local-shipping" size={18} color="#5f55da" />
            <Text style={styles.label}>Cash on delivery</Text>
          </View>
          <View style={[styles.checkbox, isChecked && selectedPayment === "cash" && styles.checkedBox]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleCheckBox("mastercard")}
        >
          <View style={styles.checkboxRow}>
            <MaterialIcons name="credit-card" size={18} color="#5f55da" />
            <Text style={styles.label}>MasterCard</Text>
          </View>
          <View style={[styles.checkbox, isChecked && selectedPayment === "mastercard" && styles.checkedBox]} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btnConfirm, (isChecked && userData.address) && styles.btnConfirmed]}
        onPress={handleConfirm}
        disabled={!isChecked || !userData.address}
      >
        <Text style={styles.btnConfirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: screen.width * 0.03, // Responsive padding
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: screen.height * 0.02, // Responsive margin
  },
  textHeader: {
    fontWeight: "bold",
    fontSize: screen.width * 0.05, // Responsive font size
  },
  deliverySection: {
    marginTop: screen.height * 0.03, // Responsive margin
  },
  infoDeliveryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screen.height * 0.02, // Responsive margin
  },
  infoDeliveryIcon: {
    width: screen.width * 0.1, // Responsive size
    height: screen.width * 0.1, // Responsive size
    borderRadius: screen.width * 0.05, // Responsive border radius
    backgroundColor: "#eefafd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: screen.width * 0.03, // Responsive margin
  },
  infoDeliveryText1: {
    fontSize: screen.width * 0.04, // Responsive font size
    color: "#121212",
  },
  infoDeliveryText2: {
    fontSize: screen.width * 0.035, // Responsive font size
    color: "gray",
  },
  noAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: screen.width * 0.03, // Responsive gap
  },
  addAddressButton: {
    width: screen.width * 0.3, // Responsive width
    height: screen.height * 0.05, // Responsive height
    backgroundColor: "#5f55da",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: screen.width * 0.02, // Responsive border radius
  },
  addAddressText: {
    color: "white",
    fontSize: screen.width * 0.035, // Responsive font size
  },
  paymentSection: {
    marginVertical: screen.height * 0.03, // Responsive margin
  },
  paymentHead: {
    fontSize: screen.width * 0.045, // Responsive font size
    fontWeight: "500",
    marginBottom: screen.height * 0.02, // Responsive margin
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: screen.height * 0.01, // Responsive margin
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: screen.width * 0.03, // Responsive gap
  },
  checkbox: {
    width: screen.width * 0.04, // Responsive size
    height: screen.width * 0.04, // Responsive size
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: screen.width * 0.02, // Responsive border radius
    backgroundColor: "white",
  },
  checkedBox: {
    backgroundColor: "#5f55da",
    borderColor: "black",
  },
  label: {
    fontSize: screen.width * 0.04, // Responsive font size
    color: "gray",
  },
  btnConfirm: {
    marginTop: screen.height * 0.04, // Responsive margin
    padding: screen.width * 0.03, // Responsive padding
    borderRadius: screen.width * 0.02, // Responsive border radius
    backgroundColor: "gray",
    alignItems: "center",
    position: "absolute",
    bottom: screen.height * 0.02, // Responsive position
    left: screen.width * 0.03, // Responsive position
    right: screen.width * 0.03, // Responsive position
  },
  btnConfirmed: {
    backgroundColor: "#5f55da",
  },
  btnConfirmText: {
    color: "white",
    fontSize: screen.width * 0.045, // Responsive font size
  },
});