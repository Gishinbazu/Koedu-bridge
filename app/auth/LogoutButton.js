// app/components/LogoutButton.js
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import LogoutConfirmModal from "../../components/modal/LogoutConfirmModal";
import { logoutUser } from "../../services/authApi";

export default function LogoutButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const openModal = () => setShowModal(true);

  const handleCancel = () => {
    if (loading) return;
    setShowModal(false);
  };

  const handleConfirmLogout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await logoutUser(); 
      router.replace("/auth/login");
    } catch (err) {
      console.log("logout error:", err.message);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <Pressable
        onPress={openModal}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          backgroundColor: "rgba(15,23,42,0.95)",
          borderWidth: 1,
          borderColor: "#f97316",
          gap: 6,
        }}
      >
        <Ionicons name="log-out-outline" size={16} color="#f97316" />
        <Text
          style={{
            color: "#f97316",
            fontWeight: "700",
            fontSize: 13,
          }}
        >
          Logout
        </Text>
      </Pressable>

      <LogoutConfirmModal
        visible={showModal}
        loading={loading}
        onCancel={handleCancel}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
