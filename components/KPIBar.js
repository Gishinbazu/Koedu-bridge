import { memo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

/**
 * Props:
 *  - theme: { primary, subText, surface, stroke }
 *  - isSmall: boolean (≤520px)
 *  - items?: [{ n: string, l: string }]
 */
function KPIBar({ theme, isSmall, items }) {
  const data =
    items ??
    [
      { n: '3–5x', l: 'Faster application review' },
      { n: '30+',  l: 'Partner universities' },
      { n: '24–72h', l: 'Initial document check' },
      { n: '100%', l: 'Secure, GDPR-aligned' },
    ];

  return (
    <View
      style={[
        styles.kpiStrip,
        isSmall && mobile.kpiStrip,
        { borderColor: theme.stroke, backgroundColor: theme.surface },
      ]}
    >
      {data.map((item, idx) => (
        <View key={idx} style={[styles.kpiItem, isSmall && mobile.kpiItem]}>
          <Text style={[styles.kpiNumber, isSmall && mobile.kpiNumber, { color: theme.primary }]}>
            {item.n}
          </Text>
          <Text style={[styles.kpiLabel, isSmall && mobile.kpiLabel, { color: theme.subText }]}>
            {item.l}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default memo(KPIBar);

const styles = StyleSheet.create({
  kpiStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  kpiItem: { width: '48%', maxWidth: 260, minWidth: 160 },
  kpiNumber: { fontWeight: '900', fontSize: 22 },
  kpiLabel: { marginTop: 2 },
});

const mobile = StyleSheet.create({
  kpiStrip: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    borderRadius: 14,
    ...Platform.select({
      android: { shadowOpacity: 0.04, elevation: 1 },
      ios:     { shadowOpacity: 0.06 },
      default: {},
    }),
  },
  kpiItem:   { width: '100%', maxWidth: '100%' },
  kpiNumber: { fontSize: 20 },
  kpiLabel:  { fontSize: 13 },
});
