import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { useState } from "react";
import players from "../../assets/data/allPlayers.json";

const { width } = Dimensions.get("window");

export default function QuizScreen() {
  const [player, setPlayer] = useState<any>(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    setPlayer(players[randomIndex]);
    setGuess("");
    setFeedback(null);
    setSuggestions([]);
  };

  const startGame = () => {
    setScore(0);
    setRound(0);
    setGameOver(false);
    getRandomPlayer();
  };

  const checkAnswer = () => {
    if (!player) return;
    if (guess.trim().toLowerCase() === player.name.toLowerCase()) {
      setFeedback("✅ Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`❌ Wrong! Answer: ${player.name}`);
    }

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound >= 2) {
        setGameOver(true);
        setPlayer(null);
      } else {
        setRound(nextRound);
        getRandomPlayer();
      }
    }, 1500);
  };

  const handleGuessChange = (text: string) => {
    setGuess(text);
    if (text.length > 0) {
      const filtered = players.filter((p) =>
        p.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (name: string) => {
    setGuess(name);
    setSuggestions([]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100} // adjust depending on your header height
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Guess the Player</Text>

        {!player && !gameOver && (
          <TouchableOpacity
            style={styles.kickOffButton}
            onPress={startGame}
            activeOpacity={0.9}
          >
            <Text style={styles.kickOffButtonText}>Start Round</Text>
            <Text style={styles.kickOffButtonIcon}>⚽</Text>
          </TouchableOpacity>
        )}

        {player && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Career Path</Text>
            <View style={styles.careerTableHeader}>
              <Text style={[styles.headerCell, { flex: 1.2 }]}>Years</Text>
              <Text style={[styles.headerCell, { flex: 2 }]}>Team</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              {player.career.length === 0 ? (
                <Text style={styles.noData}>No career data available</Text>
              ) : (
                player.career.map((step: any, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.careerRow,
                      {
                        backgroundColor:
                          index % 2 === 0
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(255,255,255,0.03)",
                      },
                    ]}
                  >
                    <Text
                      style={[styles.cell, { flex: 1.2, color: "#b2fefa" }]}
                    >
                      {step.years || "?"}
                    </Text>
                    <Text style={[styles.cell, { flex: 2 }]}>
                      {step.team}
                      {step.loan ? " (loan)" : ""}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={{ width: "100%" }}>
              <TextInput
                style={styles.input}
                placeholder="Enter player name..."
                placeholderTextColor="#b2fefa"
                value={guess}
                onChangeText={handleGuessChange}
              />

              {suggestions.length > 0 && (
                <View style={styles.suggestionListWrapper}>
                  <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => selectSuggestion(item.name)}
                        style={styles.suggestionItem}
                      >
                        <Text style={styles.suggestionText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                    keyboardShouldPersistTaps="handled"
                  />
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={checkAnswer}
              activeOpacity={0.9}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            {feedback && <Text style={styles.feedback}>{feedback}</Text>}
          </View>
        )}

        {gameOver && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Round Over</Text>
            <Text style={styles.feedback}>Your Score: {score} / 2</Text>
            <TouchableOpacity
              style={styles.kickOffButton}
              onPress={startGame}
              activeOpacity={0.9}
            >
              <Text style={styles.kickOffButtonText}>Play Again</Text>
              <Text style={styles.kickOffButtonIcon}>🔁</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // same styles as before
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
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
    marginBottom: 18,
    marginTop: 10,
  },
  kickOffButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#22C55E",
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 36,
    marginVertical: 10,
    elevation: 4,
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  kickOffButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 12,
    letterSpacing: 1,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  kickOffButtonIcon: {
    fontSize: 28,
  },
  card: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "rgba(22,34,42,0.85)",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#11998e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignSelf: "center",
    maxWidth: 500,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: 1,
    textAlign: "center",
  },
  careerTableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#11998e",
    paddingBottom: 6,
    marginBottom: 4,
  },
  headerCell: {
    color: "#b2fefa",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 1,
  },
  careerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    marginBottom: 2,
  },
  cell: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 0.5,
  },
  noData: {
    fontStyle: "italic",
    color: "#b2fefa",
    marginVertical: 8,
    textAlign: "center",
  },
  input: {
    marginTop: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: "#11998e",
    borderRadius: 8,
    fontSize: 16,
    color: "#fff",
    backgroundColor: "rgba(17, 25, 40, 0.7)",
    marginBottom: 4,
  },
  suggestionList: {
    maxHeight: 150,
    backgroundColor: "rgba(17,25,40,0.9)",
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionListWrapper: {
  maxHeight: 150,
  backgroundColor: "rgba(17,25,40,0.9)",
  borderRadius: 8,
  marginTop: 4,
  zIndex: 10,
},
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#11998e",
  },
  suggestionText: {
    color: "#fff",
    fontSize: 16,
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
  feedback: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
