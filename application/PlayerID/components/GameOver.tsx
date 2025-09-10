import { Text, TouchableOpacity, StyleSheet, Animated, Easing, View } from "react-native";
import { useEffect, useRef } from "react";
import { useGameStore } from "../utils/store";

export default function GameOver() {
  const { score, restartGame } = useGameStore();
  const total = 2; // current round count
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      // slight extra scale spring feel
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={styles.title}>Game Over</Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Final Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreDivider}>/</Text>
        <Text style={styles.scoreTotal}>{total}</Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={restartGame} activeOpacity={0.9}>
        <Text style={styles.submitButtonText}>Play Again</Text>
      </TouchableOpacity>
    </Animated.View>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    marginBottom: 8,
    marginTop: 10,
  },
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
    marginHorizontal: 2,
  },
  scoreTotal: {
    color: "#b2fefa",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 2,
  },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 36,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
