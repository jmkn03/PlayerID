// screens/Leaderboard.tsx
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <Text style={styles.title}>Leaderboards</Text>
          <Text style={styles.subtitle}>See how you rank!</Text>
          <ScrollView style={{ marginTop: 10 }}>
            {scores.map((item) => (
              <Text key={item.mode} style={styles.leaderboardEntry}>
                {item.mode} - {item.score} pts
              </Text>
            ))}
          </ScrollView>
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
    marginBottom: 8,
    textAlign: "center",
  },
  leaderboardEntry: {
    color: "#fff",
    fontSize: 16,
    marginVertical: 4,
    letterSpacing: 0.5,
  },
});
