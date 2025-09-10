import { Text, TextInput, TouchableOpacity, StyleSheet, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useEffect } from "react";
import { useGameStore } from "../../utils/store";
import CareerPath from "../../components/CareerPath";
import SuggestionsList from "../../components/SuggestionsList";
import GameOverScreen from "@/components/GameOverSurvival";
import ScoreHeaderSurvival from "@/components/ScoreHeaderSurvival";

export default function SurvivalScreen() {
  const {
    player,
    guess,
    feedback,
    handleInputChange,
    gameOver,
    startMode2,
    submitMode2Answer,
    mode2Score,
    mode2HighScore,
  } = useGameStore();

  useEffect(() => {
    startMode2();
  }, []);

  if (gameOver) {
    return (
      <GameOverScreen/>
    );
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Survival Mode</Text>
      <ScoreHeaderSurvival/>

      {player && (
        <>
          <CareerPath />
          <TextInput
            style={styles.input}
            placeholder="Enter player name..."
            placeholderTextColor="#b2fefa"
            value={guess}
            onChangeText={handleInputChange}
            onFocus={() => useGameStore.setState({ showSuggestions: true })}
          />
          <SuggestionsList />
          <TouchableOpacity style={styles.submitButton} onPress={submitMode2Answer}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
          {feedback && <Text style={styles.feedback}>{feedback}</Text>}
        </>
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  scoreText: {
    color: "#b2fefa",
    fontSize: 18,
    marginVertical: 6,
    fontWeight: "600",
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
    marginBottom: 10,
    width: "100%",
    maxWidth: 500,
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
