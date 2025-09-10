import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function PlayMenu() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <Text style={styles.title}>Choose Game Mode</Text>
          <Text style={styles.subtitle}>Select how you want to play</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/play/mode1")}
          >
            <Text style={styles.buttonText}>Survival Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/play/mode3")}
          >
            <Text style={styles.buttonText}>Classic Mode</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 18,
  },
  card: {
    backgroundColor: "rgba(22,34,42,0.85)",
    borderRadius: 20,
    padding: 24,
    marginVertical: 10,
    shadowColor: "#11998e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    alignSelf: "center",
    minWidth: 280,
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#b2fefa",
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 18,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
    elevation: 5,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
