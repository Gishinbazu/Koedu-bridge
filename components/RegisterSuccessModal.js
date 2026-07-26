// components/RegisterSuccessModal.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function RegisterSuccessModal({ visible, onClose }) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scale.setValue(0.6);
      opacity.setValue(0);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalCard,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={60}
            color="#22c55e"
            style={{ marginBottom: 10 }}
          />

          <Text style={styles.title}>Account Created 🎉</Text>
          <Text style={styles.text}>
            Your KOEDU Bridge account is ready!
          </Text>
          <Text style={styles.text}>You can now log in.</Text>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: 280,
    padding: 24,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    color: "#111827",
  },
  text: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#f97316",
    borderRadius: 12,
  },
  buttonText: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 15,
  },
});
