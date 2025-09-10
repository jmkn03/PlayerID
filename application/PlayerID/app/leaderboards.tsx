// screens/Leaderboard.tsx
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Leaderboard() {
  const [scores, setScores] = useState<{ mode: string; score: number }[]>([]);

  useEffect(() => {
    const loadScores = async () => {
      try {
        const survivalHigh = await AsyncStorage.getItem("SurvivalHighScore");
        const parsed = survivalHigh ? parseInt(survivalHigh, 10) : 0;

        setScores([
          { mode: "Survival", score: parsed },
        ]);
      } catch (err) {
        console.error("Error loading scores", err);
      }
    };

    loadScores();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <FlatList
        data={scores}
        keyExtractor={(item) => item.mode}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.mode}>{item.mode}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(17,25,40,1)",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    letterSpacing: 2,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(22,34,42,0.85)",
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#11998e",
  },
  mode: {
    fontSize: 18,
    fontWeight: "600",
    color: "#b2fefa",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
