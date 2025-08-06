
export default function ResetConfirmation() {
  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✅ Mot de passe modifié</h1>
        <p style={styles.text}>
          Votre mot de passe a été réinitialisé avec succès.
          <br />
          Vous pouvez maintenant vous connecter à votre compte KOEDU Bridge.
        </p>
        <a href="/auth/login" style={styles.button}>Se connecter</a>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px 32px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    maxWidth: 480,
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    color: '#003366',
    marginBottom: '16px',
  },
  text: {
    fontSize: '16px',
    color: '#444',
    marginBottom: '32px',
    lineHeight: '1.5',
  },
  button: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#003366',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
  },
};
