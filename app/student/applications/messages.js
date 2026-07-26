// app/student/messages.js
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function StudentMessagesScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      from: "koedu",
      text: "Welcome to KOEDU Bridge! If you have any questions about your application, send us a message here.",
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), from: "me", text: input.trim() },
    ]);
    setInput("");
  };

  return (
    <LinearGradient colors={["#050816", "#02010f"]} style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages with KOEDU Team</Text>
        <Text style={styles.subtitle}>
          This is a simple messaging area. Later we branch it to the real
          backend.
        </Text>

        <View style={styles.chatBox}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 12 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.bubble,
                  item.from === "me"
                    ? styles.bubbleMe
                    : styles.bubbleKoedu,
                ]}
              >
                <Text
                  style={
                    item.from === "me"
                      ? styles.bubbleTextMe
                      : styles.bubbleTextKoedu
                  }
                >
                  {item.text}
                </Text>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Ask something about your application..."
              placeholderTextColor="rgba(148,163,184,0.9)"
            />
            <Pressable style={styles.sendBtn} onPress={handleSend}>
              <Ionicons name="send" size={18} color="#111827" />
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingTop: 80, flex: 1 },
  title: { color: "#f9fafb", fontSize: 22, fontWeight: "800" },
  subtitle: { color: "#9ca3af", marginTop: 4, marginBottom: 12 },
  chatBox: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
    backgroundColor: "rgba(15,23,42,0.96)",
    overflow: "hidden",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  bubbleMe: {
    backgroundColor: "#f97316",
    marginLeft: "auto",
  },
  bubbleKoedu: {
    backgroundColor: "rgba(31,41,55,0.9)",
    marginRight: "auto",
  },
  bubbleTextMe: { color: "#111827" },
  bubbleTextKoedu: { color: "#e5e7eb" },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(55,65,81,0.8)",
  },
  input: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: "#f9fafb",
    fontSize: 14,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
  },
});
