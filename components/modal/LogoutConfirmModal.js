import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";

export default function LogoutConfirmModal({
  visible,
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Overlay */}
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        {/* Modal Card */}
        <View
          style={{
            width: "100%",
            maxWidth: 380,
            borderRadius: 20,
            backgroundColor: "rgba(15,23,42,0.96)",
            borderWidth: 1,
            borderColor: "rgba(148,163,184,0.25)",
            padding: 18,
          }}
        >
          {/* Icon */}
          <View
            style={{
              alignSelf: "center",
              marginBottom: 10,
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(249,115,22,0.15)",
              borderWidth: 1,
              borderColor: "rgba(249,115,22,0.35)",
            }}
          >
            <Ionicons name="log-out-outline" size={26} color="#f97316" />
          </View>

          {/* Title */}
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Sign out
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 14,
              textAlign: "center",
              marginTop: 8,
              lineHeight: 20,
            }}
          >
            Are you sure you want to sign out of your account?
          </Text>

          {/* Actions */}
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 18,
            }}
          >
            {/* Cancel */}
            <Pressable
              onPress={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "rgba(148,163,184,0.35)",
                alignItems: "center",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                }}
              >
                Cancel
              </Text>
            </Pressable>

            {/* Confirm */}
            <Pressable
              onPress={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                borderRadius: 14,
                overflow: "hidden",
                opacity: loading ? 0.8 : 1,
              }}
            >
              <LinearGradient
                colors={["#f97316", "#f59e0b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#111" />
                ) : (
                  <Text
                    style={{
                      color: "#111",
                      fontWeight: "800",
                    }}
                  >
                    Sign out
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
