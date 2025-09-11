import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useGameStore } from "../../utils/store";

const { width } = Dimensions.get("window");

const difficulties = [
  { level: "Easy", color: ["#22c55e", "#16a34a"], desc: "For warm-up. Lower points." },
  { level: "Medium", color: ["#3b82f6", "#1d4ed8"], desc: "Balanced challenge." },
  { level: "Hard", color: ["#ef4444", "#b91c1c"], desc: "For pros. Higher points." },
];

export default function DifficultySelectionScreen() {
  const router = useRouter();
  const setDifficulty = useGameStore((s) => s.setDifficulty);

  const handleSelect = (level: "Easy" | "Medium" | "Hard") => {
    setDifficulty(level);
    router.replace("/play/mode3"); // Classic mode
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#2c5364", "#11998e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Choose Difficulty</Text>
        {difficulties.map((d) => (
          <TouchableOpacity
            key={d.level}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => handleSelect(d.level as "Easy" | "Medium" | "Hard")}
          >
            <LinearGradient
              colors={d.color}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardInner}
            >
              <Text style={styles.cardTitle}>{d.level}</Text>
              <Text style={styles.cardDesc}>{d.desc}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.9,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    letterSpacing: 1,
  },
  card: {
    width: "100%",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },
  cardInner: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: 1,
  },
  cardDesc: {
    fontSize: 16,
    color: "#f1f5f9",
    textAlign: "center",
  },
});
