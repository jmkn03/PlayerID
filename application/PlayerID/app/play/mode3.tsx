import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useGameStore } from "../../utils/store";
import ScoreHeader from "../../components/ScoreHeader";
import CareerPath from "../../components/CareerPath";
import SuggestionsList from "../../components/SuggestionsList";
import GameOverScreen from "../../components/GameOver";

const { width } = Dimensions.get("window");

export default function QuizScreen() {
  // Zustand store
  const {
    player,
    guess,
    feedback,
    score,
    question,
    gameOver,
    showSuggestions,
    filteredNames,
    getRandomPlayer,
    checkAnswer,
    handleInputChange,
    handleSuggestionPress,
    restartGame,
  } = useGameStore();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const careerAnim = useRef(new Animated.Value(0)).current;
  const gameOverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getRandomPlayer();
  }, []);

  useEffect(() => {
    if (feedback) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();

    const timer = setTimeout(() => {
      useGameStore.getState().nextQuestion();
    }, 800);

    return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    careerAnim.setValue(0);
    Animated.timing(careerAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [player, careerAnim]);

  useEffect(() => {
    if (gameOver) {
      gameOverAnim.setValue(0);
      Animated.parallel([
        Animated.timing(gameOverAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [gameOver, gameOverAnim, scaleAnim]);

  useFocusEffect(
    useCallback(() => {
      restartGame();
    }, [restartGame])
  );

  if (gameOver) return <GameOverScreen />;

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} enableOnAndroid keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Guess the Player</Text>
      <ScoreHeader />

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
          <TouchableOpacity style={styles.submitButton} onPress={checkAnswer}>
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
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: "#22C55E",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 8,
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    width: "100%",
    maxWidth: 500,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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