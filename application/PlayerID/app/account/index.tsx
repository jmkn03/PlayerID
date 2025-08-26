import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Account</Text>
      <Text style={styles.subtitle}>Sign in to save your progress</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>🔑 Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>📝 Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: "#6B7280" }]}>
        <Text style={styles.buttonText}>🎮 Continue as Guest</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#111" },
  subtitle: { fontSize: 16, color: "#374151", marginBottom: 30 },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
