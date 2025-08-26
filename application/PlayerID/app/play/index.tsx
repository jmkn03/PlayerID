import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function PlayMenu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Choose Game Mode</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/play/mode1")}>
        <Text style={styles.buttonText}>🧩 Classic Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/play/mode2")}>
        <Text style={styles.buttonText}>⏱️ Timed Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/play/mode3")}>
        <Text style={styles.buttonText}>❤️ Survival Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30, color: "#111" },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
