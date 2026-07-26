// components/StudentDocumentsViewer.js
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Linking,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { API_BASE_URL } from "../services/apiClient"; // Ajustez le chemin selon votre structure

/* =========================================================
   HELPERS
   ========================================================= */

// Convertit une URL relative (/uploads/xxx.pdf) en URL absolue (http://localhost:8000/uploads/xxx.pdf)
export function ensureAbsoluteUrl(maybeUrl) {
  if (!maybeUrl || typeof maybeUrl !== "string") return null;

  if (maybeUrl.startsWith("http://") || maybeUrl.startsWith("https://")) {
    return maybeUrl;
  }

  if (maybeUrl.startsWith("/")) {
    return `${API_BASE_URL}${maybeUrl}`;
  }

  return `${API_BASE_URL}/${maybeUrl}`;
}

// Vérifie si le fichier est une image (PNG, JPG, WEBP)
export function looksLikeImage(url, fileName) {
  const str = (url || fileName || "").toLowerCase();
  return (
    str.endsWith(".png") ||
    str.endsWith(".jpg") ||
    str.endsWith(".jpeg") ||
    str.endsWith(".webp") ||
    str.includes("image/")
  );
}

// Ouvre le fichier au clic (Nouvel onglet sur Web, Navigateur/Lecteur sur Mobile)
export const handleOpenFile = async (fileUrl) => {
  const fullUrl = ensureAbsoluteUrl(fileUrl);

  if (!fullUrl) {
    alert("Aucun lien disponible pour ce fichier.");
    return;
  }

  try {
    if (Platform.OS === "web") {
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    } else {
      const canOpen = await Linking.canOpenURL(fullUrl);
      if (canOpen) {
        await Linking.openURL(fullUrl);
      } else {
        alert("Impossible d'ouvrir ce lien sur votre appareil.");
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'ouverture du fichier :", error);
    alert("Impossible d'ouvrir le document.");
  }
};

/* =========================================================
   COMPOSANT
   ========================================================= */

export default function StudentDocumentsViewer({
  documents,
  title = "Submitted documents",
}) {
  // Normalisation des documents en tableau { label, url, name }
  const docList = React.useMemo(() => {
    if (!documents) return [];

    if (Array.isArray(documents)) {
      return documents.map((doc, idx) => ({
        label: doc.label || `Document ${idx + 1}`,
        url: doc.url || doc.path || doc,
        name:
          doc.name || (typeof doc === "string" ? doc.split("/").pop() : null),
      }));
    }

    if (typeof documents === "object") {
      return Object.entries(documents)
        .filter(([_, val]) => Boolean(val))
        .map(([key, val]) => {
          const formattedLabel = key.replace(/([A-Z])/g, " $1").trim();
          const capitalizedLabel =
            formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1);

          if (typeof val === "string") {
            return {
              label: capitalizedLabel,
              url: val,
              name: val.split("/").pop(),
            };
          }

          return {
            label: capitalizedLabel,
            url: val.url || val.path,
            name: val.name || `${key}`,
          };
        });
    }

    return [];
  }, [documents]);

  if (docList.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.emptyText}>No documents uploaded yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {title} ({docList.length})
      </Text>

      {docList.map((doc, idx) => {
        const fullUrl = ensureAbsoluteUrl(doc.url);
        const isImage = looksLikeImage(fullUrl, doc.name);

        return (
          <Pressable
            key={`${doc.label}-${idx}`}
            onPress={() => handleOpenFile(doc.url)}
            disabled={!fullUrl}
            style={({ pressed }) => [
              styles.docCard,
              pressed && fullUrl && styles.docCardPressed,
              !fullUrl && styles.docCardDisabled,
            ]}
          >
            {/* EN-TÊTE DU DOCUMENT */}
            <View style={styles.docHeaderRow}>
              <Text style={styles.docLabel}>{doc.label}</Text>
              {isImage ? (
                <Text style={styles.badgeImage}>PNG / Image</Text>
              ) : (
                <Text style={styles.badgePdf}>PDF</Text>
              )}
            </View>

            {/* APERÇU VISUEL POUR LES IMAGES */}
            {isImage && fullUrl ? (
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: fullUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ) : null}

            {/* BARRE D'ACTION ET BOUTON OUVRIR */}
            <View style={styles.fileRow}>
              <Ionicons
                name={isImage ? "image-outline" : "document-text-outline"}
                size={22}
                color={isImage ? "#F97316" : "#38BDF8"}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {doc.name || `${doc.label}`}
                </Text>
                <Text style={styles.clickHint}>
                  {fullUrl ? "Click to view file" : "No file URL available"}
                </Text>
              </View>

              {fullUrl ? (
                <View style={styles.openBtn}>
                  <Ionicons name="open-outline" size={15} color="#FFFFFF" />
                  <Text style={styles.openBtnText}>Open</Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

/* =========================================================
   STYLES
   ========================================================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(15,23,42,0.95)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.3)",
    marginVertical: 10,
  },
  cardTitle: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  docCard: {
    backgroundColor: "#020617",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
    marginBottom: 10,
  },
  docCardPressed: {
    opacity: 0.85,
    backgroundColor: "#0F172A",
  },
  docCardDisabled: {
    opacity: 0.5,
  },
  docHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  docLabel: {
    color: "#F9FAFB",
    fontSize: 13,
    fontWeight: "700",
  },
  badgePdf: {
    color: "#38BDF8",
    fontSize: 10,
    fontWeight: "800",
    backgroundColor: "rgba(56,189,248,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeImage: {
    color: "#F97316",
    fontSize: 10,
    fontWeight: "800",
    backgroundColor: "rgba(249,115,22,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  imageWrap: {
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fileName: {
    color: "#F9FAFB",
    fontSize: 13,
    fontWeight: "600",
  },
  clickHint: {
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 2,
  },
  openBtn: {
    backgroundColor: "#F97316",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  openBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
