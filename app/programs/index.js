import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { apiFetch } from "../../services/apiClient";

const COLORS = {
  bgStart: "#050816",
  bgEnd: "#02010f",
  primary: "#F97316",
  cardBg: "rgba(15,23,42,0.95)",
  border: "rgba(148,163,184,0.2)",
  text: "#F9FAFB",
  textMuted: "#9CA3AF",
  danger: "#EF4444",
};

const PROGRAM_TYPES = ["language", "bachelor", "master"];

export default function AdminProgramsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [title, setTitle] = useState("");
  const [university, setUniversity] = useState("");
  const [type, setType] = useState("bachelor");
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/programs", { method: "GET" });
      setPrograms(res?.programs || res || []);
    } catch (err) {
      console.log("Error loading programs:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (alertTitle, message) => {
    if (Platform.OS === "web") {
      alert(`${alertTitle}: ${message}`);
    } else {
      Alert.alert(alertTitle, message);
    }
  };

  // Sélectionner un fichier PDF local depuis l'ordinateur/bureau
  const handlePickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPdfFile(result.assets[0]);
      }
    } catch (err) {
      console.log("Error picking PDF:", err);
    }
  };

  const handleOpenCreate = () => {
    setEditingProgram(null);
    setTitle("");
    setUniversity("");
    setType("bachelor");
    setPdfFile(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (prog) => {
    setEditingProgram(prog);
    setTitle(prog.title || prog.name || "");
    setUniversity(prog.university || "");
    setType(prog.type || "bachelor");
    setPdfFile(
      prog.pdfUrl ? { name: "Existing PDF Attached", uri: prog.pdfUrl } : null,
    );
    setModalVisible(true);
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedUniversity = university.trim();

    if (!trimmedTitle || !trimmedUniversity) {
      showAlert("Validation Error", "Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      let bodyData;

      // Si un nouveau fichier local est sélectionné, utiliser FormData
      if (pdfFile && pdfFile.file) {
        const formData = new FormData();
        formData.append("name", trimmedTitle);
        formData.append("title", trimmedTitle);
        formData.append("university", trimmedUniversity);
        formData.append("type", type);
        formData.append("pdf", pdfFile.file);
        bodyData = formData;
      } else {
        bodyData = {
          name: trimmedTitle,
          title: trimmedTitle,
          university: trimmedUniversity,
          type,
          pdfUrl: pdfFile?.uri || "",
        };
      }

      if (editingProgram) {
        await apiFetch(
          `/api/admin/programs/${editingProgram.id || editingProgram._id}`,
          {
            method: "PUT",
            body: bodyData,
          },
        );
        showAlert("Success", "Program updated successfully!");
      } else {
        await apiFetch("/api/admin/programs", {
          method: "POST",
          body: bodyData,
        });
        showAlert("Success", "Program created successfully!");
      }

      setModalVisible(false);
      fetchPrograms();
    } catch (err) {
      console.log("Save program error:", err);
      showAlert("Error", err.message || "Failed to save program.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (prog) => {
    const deleteAction = async () => {
      try {
        await apiFetch(`/api/admin/programs/${prog.id || prog._id}`, {
          method: "DELETE",
        });
        fetchPrograms();
      } catch (err) {
        showAlert("Error", "Failed to delete program.");
      }
    };

    const targetName = prog.title || prog.name || "this program";

    if (Platform.OS === "web") {
      if (confirm(`Are you sure you want to delete "${targetName}"?`)) {
        deleteAction();
      }
    } else {
      Alert.alert(
        "Delete Program",
        `Are you sure you want to delete "${targetName}"?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: deleteAction },
        ],
      );
    }
  };

  return (
    <LinearGradient colors={[COLORS.bgStart, COLORS.bgEnd]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-outline" size={20} color={COLORS.text} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Manage Programs</Text>

          <Pressable onPress={handleOpenCreate} style={styles.addBtn}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            {programs.map((prog, idx) => (
              <View key={prog.id || prog._id || idx} style={styles.programCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progTitle}>
                    {prog.title || prog.name}
                  </Text>
                  <Text style={styles.progSub}>
                    {prog.university} •{" "}
                    <Text style={styles.typeTag}>{prog.type}</Text>
                  </Text>
                  {prog.pdfUrl ? (
                    <Text style={styles.pdfBadge}>📄 PDF Attached</Text>
                  ) : null}
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={() => handleOpenEdit(prog)}
                    style={styles.actionIconBtn}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(prog)}
                    style={styles.actionIconBtn}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={COLORS.danger}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingProgram ? "Edit Program" : "Add New Program"}
              </Text>

              <Text style={styles.label}>Program Name</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Computer Science"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.label}>University</Text>
              <TextInput
                style={styles.input}
                value={university}
                onChangeText={setUniversity}
                placeholder="e.g. Sun Moon University"
                placeholderTextColor={COLORS.textMuted}
              />

              <Text style={styles.label}>Program Type</Text>
              <View style={styles.typeSelectorRow}>
                {PROGRAM_TYPES.map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setType(t)}
                    style={[
                      styles.typeOption,
                      type === t && styles.typeOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        type === t && styles.typeOptionTextSelected,
                      ]}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* CHAMP D'UPLOAD / SÉLECTION DE PDF DEPUIS L'ORDINATEUR */}
              <Text style={styles.label}>
                Program Syllabus / Brochure (PDF)
              </Text>
              <Pressable onPress={handlePickPdf} style={styles.filePickerBtn}>
                <Ionicons
                  name="document-attach-outline"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.filePickerText} numberOfLines={1}>
                  {pdfFile ? pdfFile.name : "Select PDF from desktop..."}
                </Text>
              </Pressable>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={{ color: COLORS.textMuted }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSave}
                  style={styles.saveBtn}
                  disabled={saving}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    {saving ? "Saving..." : "Save"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  backText: { color: COLORS.text, fontSize: 14 },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: "700" },
  addBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "700", marginLeft: 4 },
  content: { padding: 16, gap: 12 },
  programCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progTitle: { color: COLORS.text, fontSize: 16, fontWeight: "700" },
  progSub: { color: COLORS.textMuted, fontSize: 13, marginTop: 4 },
  typeTag: { color: COLORS.primary, fontWeight: "600" },
  pdfBadge: { color: "#3B82F6", fontSize: 12, marginTop: 4 },
  actionIconBtn: { padding: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#0F172A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    color: COLORS.text,
    padding: 12,
  },
  filePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  filePickerText: {
    color: COLORS.text,
    fontSize: 13,
    flex: 1,
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  typeOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeOptionText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  typeOptionTextSelected: {
    color: "#ffffff",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: { padding: 10 },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
