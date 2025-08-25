import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlayerID Quiz</Text>
      <Text style={styles.subtitle}>Test your knowledge and climb the ranks!</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/play")}>
        <Text style={styles.buttonText}>▶️ Play</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/settings")}>
        <Text style={styles.buttonText}>⚙️ Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/leaderboards")}>
        <Text style={styles.buttonText}>🏆 Leaderboards</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/guide")}>
        <Text style={styles.buttonText}>📘 Guide</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/account")}>
        <Text style={styles.buttonText}>👤 Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF4FF",
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 8,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
