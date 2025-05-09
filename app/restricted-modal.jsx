import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";

export default function RestrictedModal() {
  const router = useRouter();
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts; since i use an empty dependency array
    setAnimation(true);
  }, []);

  return (
    <View style={styles.container}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />
      <View style={[styles.modalContent, animation && styles.modalAnimate]}>
        {/* Lock Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        </View>

        {/* Dismiss Button (X) at Top Right */}
        <Pressable
          style={styles.dismissButton}
          hitSlop={15}
          onPress={() => router.back()}
        >
          <Text style={styles.dismissText}>✕</Text>
        </Pressable>

        {/* -- Modal Title and Message -- */}
        <Text style={styles.title}>Members Only</Text>
        <Text style={styles.message}>
          Create an account or sign in to access exclusive features, save your
          favorites, and complete purchases.
        </Text>

        {/* -- Benefits List -- */}
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Exclusive member discounts</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Save your shopping cart</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✓</Text>
            <Text style={styles.benefitText}>Unlock Full Access</Text>
          </View>
        </View>
        {/* Continue as Guest Option */}
        <Pressable style={styles.guestButton} onPress={() => router.back()}>
          <Text style={styles.guestButtonText}>Continue Browsing</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.65)", // Darker backdrop for more focus
  },
  modalContent: {
    width: "85%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
  modalAnimate: {
    opacity: 1,
    transform: [{ translateY: 0 }],
    transition: "all 0.3s ease-out",
  },
  iconContainer: {
    marginTop: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  lockIcon: {
    fontSize: 30,
  },
  dismissButton: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 8,
  },
  dismissText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#222",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 22,
    color: "#444",
    lineHeight: 22,
  },
  benefitsList: {
    width: "100%",
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  benefitIcon: {
    fontSize: 16,
    color: "#6c63ff",
    fontWeight: "bold",
    marginRight: 10,
  },
  benefitText: {
    fontSize: 15,
    color: "#333",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 16,
  },
  signUpButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#6c63ff",
    marginBottom: 12,
  },
  signInButton: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#6c63ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signInButtonText: {
    color: "#6c63ff",
    fontSize: 16,
    fontWeight: "600",
  },
  guestButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 5,
  },
  guestButtonText: {
    color: "#6c63ff",
    fontSize: 15,
    textDecorationLine: "underline",
  },
});