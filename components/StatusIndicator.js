import { StyleSheet, Text, View } from 'react-native';

export default function StatusIndicator({ status }) {
  let backgroundColor = '#e2e8f0'; // par défaut gris clair
  let textColor = '#1e293b'; // gris foncé
  let label = 'Statut inconnu';

  switch (status) {
    case 'pending':
      backgroundColor = '#facc15'; // jaune
      label = 'En attente';
      break;
    case 'accepted':
      backgroundColor = '#22c55e'; // vert
      label = 'Accepté';
      break;
    case 'rejected':
      backgroundColor = '#ef4444'; // rouge
      label = 'Rejeté';
      break;
    case 'incomplete':
      backgroundColor = '#38bdf8'; // bleu
      label = 'Incomplet';
      break;
    default:
      break;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
});
