import { View, Text, StyleSheet } from "react-native";
import { useGameStore } from "../utils/store";

export default function ScoreHeaderSurvival() {
  const { mode2Score, mode2HighScore } = useGameStore();

  return (
    <View style={styles.scoreContainer}>
      <Text style={styles.scoreLabel}>Score:</Text>
      <Text style={styles.scoreValue}>{mode2Score}</Text>
      <Text style={styles.scoreDivider}>|</Text>
      <Text style={styles.scoreLabel}>High:</Text>
      <Text style={styles.scoreValue}>{mode2HighScore}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(17, 25, 40, 0.7)",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginBottom: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#11998e",
    shadowColor: "#11998e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreLabel: {
    color: "#b2fefa",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 4,
    letterSpacing: 0.5,
  },
  scoreValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 2,
  },
  scoreDivider: {
    color: "#b2fefa",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
});