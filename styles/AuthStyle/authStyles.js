// app/auth/loginStyles.js
import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  /* Background */
  bg: { flex: 1, width: '100%', height: '100%' },
  bgDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },

  /* Container */
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(11,26,42,0.40)',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 18 },
    elevation: 18,
  },

  /* LEFT PANEL */
  leftPanel: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  logo: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 18,
    letterSpacing: 1,
  },
  welcome: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
  },
  subWelcome: {
    color: '#e2e8f0',
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },

  /* RIGHT PANEL */
  rightPanel: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.96)',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },

  /* INPUTS */
  input: {
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  disabled: { opacity: 0.7 },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  passwordInput: { flex: 1, fontSize: 16, color: '#0f172a' },
  eye: { fontSize: 18, marginLeft: 10 },

  /* OPTIONS ROW */
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: { color: '#e2e8f0', fontSize: 14, fontWeight: '600' },
  forgotText: { color: '#e2e8f0', fontSize: 14, textDecorationLine: 'underline' },

  /* BUTTON */
  button: {
    backgroundColor: '#e50914',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#b91c1c',
  },
  buttonText: {
    color: '#f9fafb',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 16,
  },

  /* LINK */
  link: {
    textAlign: 'center',
    marginTop: 16,
    color: '#e2e8f0',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
    homeButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(15,23,42,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.5)',
    marginBottom: 16,
  },
  homeButtonText: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

});
