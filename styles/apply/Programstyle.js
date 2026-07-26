import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#050816' },
  background: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: 'center',
  },
  pageTitle: {
    color: '#e5e7eb',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  pageSubtitle: {
    color: '#9ca3af',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 18,
    textAlign: 'center',
    maxWidth: 600,
  },

  cardShadow: {
    width: '100%',
    maxWidth: 980,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#f97316',
    shadowOpacity: 0.55,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 18 },
    elevation: 20,
    marginVertical: 12,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.95)',
  },
  cardInner: {
    padding: 24,
  },

  // ⭐️ STYLES MIS À JOUR POUR LE BOUTON RETURN ⭐️
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingHorizontal: 20, // Plus de padding pour un bouton plus large
    paddingVertical: 10,   // Plus de padding vertical
    borderRadius: 999,     // Très arrondi
    backgroundColor: '#1C212B', // Couleur de fond plus foncée
  },
  backButtonText: {
    color: '#F97316', // Couleur orange pour le texte
    fontSize: 16,       // Taille de police plus grande
    fontWeight: '700',  // Plus gras
    marginLeft: 8,      // Marge à gauche pour séparer l'icône du texte
  },

  filtersBlock: {
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 46,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.6)',
    shadowColor: 'rgba(249,115,22,0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  searchInput: {
    flex: 1,
    color: '#f9fafb',
    fontSize: 14,
    fontWeight: '500',
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 14,
  },
  filterGroup: { minWidth: 140, flex: 1 },
  filterLabel: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  chipActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  chipText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#111827',
    fontWeight: '800',
  },

  listBlock: {
    marginTop: 10,
    gap: 12,
  },
  programCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
  },
  programHeader: {
    marginBottom: 8,
  },
  programName: {
    color: '#f9fafb',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#f97316',
  },
  badgeText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  university: {
    color: '#d1d5db',
    fontSize: 13,
    marginBottom: 4,
  },
  overview: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#e5e7eb',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderWidth: 1,
    borderColor: '#f97316',
  },
  detailsText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    color: '#f9fafb',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default styles;