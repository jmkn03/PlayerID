import { View, Text, Button, ScrollView, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import players from "../../assets/data/allPlayers.json";

export default function QuizScreen() {
  const [player, setPlayer] = useState<any>(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    setPlayer(players[randomIndex]);
    setGuess("");
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (!player) return;
    if (guess.trim().toLowerCase() === player.name.toLowerCase()) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(`❌ Wrong! Answer: ${player.name}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Guess the Player</Text>

      <Button title="New Random Player" onPress={getRandomPlayer} />

      {player && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Career Path</Text>
          {player.career.length === 0 ? (
            <Text style={styles.noData}>No career data available</Text>
          ) : (
            player.career.map((step: any, index: number) => (
              <Text key={index} style={styles.careerStep}>
                {step.years || "?"} → {step.team}
                {step.loan ? " (loan)" : ""}
              </Text>
            ))
          )}

          <TextInput
            style={styles.input}
            placeholder="Enter player name..."
            value={guess}
            onChangeText={setGuess}
          />

          <Button title="Submit" onPress={checkAnswer} />

          {feedback && <Text style={styles.feedback}>{feedback}</Text>}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  noData: {
    fontStyle: "italic",
    color: "#666",
  },
  careerStep: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
  },
  feedback: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
