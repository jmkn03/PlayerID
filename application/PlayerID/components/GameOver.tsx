import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useGameStore } from "../utils/store";

export default function GameOverScreen() {
  const { score, totalQuestions, restartGame } = useGameStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.score}>
        Final Score: {score}/{totalQuestions}
      </Text>
      <TouchableOpacity style={styles.playAgainButton} onPress={restartGame}>
        <Text style={styles.playAgainText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    marginBottom: 20,
  },
  score: {
    fontSize: 22,
    fontWeight: "600",
    color: "#b2fefa",
    marginBottom: 30,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  playAgainButton: {
    backgroundColor: "#2563eb",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: "center",
    alignSelf: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  playAgainText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
