// app/auth/signupStyles.js
import { StyleSheet } from 'react-native';

export const signupStyles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },

  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  outer: {
    flexGrow: 1,
    padding: 32,
    gap: 24,
  },

  /* Left column */
  left: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  kicker: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    maxWidth: 520,
  },
  points: {
    marginTop: 14,
    gap: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointText: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },

  backHome: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  backHomeText: {
    color: '#fff',
    fontWeight: '800',
  },

  /* Card */
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(11,26,42,0.28)',
    overflow: 'hidden',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 10,
    textAlign: 'center',
  },

  label: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '800',
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },

  meterWrap: {
    marginTop: 6,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meterBg: {
    flex: 1,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  meterFill: {
    height: 6,
    backgroundColor: '#7CFFB2',
  },
  meterLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  termsText: {
    color: 'rgba(255,255,255,0.85)',
  },
  link: {
    color: '#FFD166',
    fontWeight: '800',
  },

  submitBtn: {
    marginTop: 14,
    backgroundColor: '#FFD166',
    borderColor: '#FFD166',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: '#0B1A2A',
    fontWeight: '900',
    fontSize: 16,
  },

  redirectRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  redirectText: {
    color: 'rgba(255,255,255,0.85)',
  },
  redirectLink: {
    color: '#7CFFB2',
    fontWeight: '900',
  },

  errorText: {
    color: '#ff9b9b',
    marginTop: 4,
    fontWeight: '700',
  },

  /* Modal */
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: '82%',
    maxWidth: 420,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontWeight: '900',
    fontSize: 18,
    color: '#0B1A2A',
  },
  modalSub: {
    color: '#334155',
    textAlign: 'center',
  },
  modalBtn: {
    marginTop: 8,
    backgroundColor: '#0B1A2A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '900',
  },
});
