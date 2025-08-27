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
    }
  }, [feedback, fadeAnim, scaleAnim]);

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

  if (gameOver) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: gameOverAnim,
            transform: [
              {
                scale: gameOverAnim.interpolate({
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
          <Text style={styles.scoreTotal}>2</Text>
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={restartGame}
          activeOpacity={0.9}
        >
          <Text style={styles.submitButtonText}>Play Again</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <Text style={styles.title}>Guess the Player</Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Question</Text>
        <Text style={styles.scoreValue}>{question}</Text>
        <Text style={styles.scoreDivider}>/</Text>
        <Text style={styles.scoreTotal}>2</Text>
        <Text style={styles.scoreLabel}> | Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      {player && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Career Path</Text>
          <View style={styles.careerTableHeader}>
            <Text style={[styles.headerCell, { flex: 1.2 }]}>Years</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Team</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Apps</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Goals</Text>
          </View>

          <Animated.View
            style={{
              opacity: careerAnim,
              transform: [
                {
                  translateY: careerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            }}
          >
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
                    <Text style={[styles.cell, { flex: 1.2, color: "#b2fefa" }]}>
                      {step.years || "?"}
                    </Text>
                    <Text style={[styles.cell, { flex: 2 }]}>
                      {step.team}
                      {step.loan ? " (loan)" : ""}
                    </Text>
                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                      {step.apps ?? "-"}
                    </Text>
                    <Text style={[styles.cell, { flex: 1, textAlign: "center" }]}>
                      {step.goals ?? "-"}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </Animated.View>

          <TextInput
            style={styles.input}
            placeholder="Enter player name..."
            placeholderTextColor="#b2fefa"
            value={guess}
            onChangeText={handleInputChange}
            onFocus={() => useGameStore.setState({ showSuggestions: true })}
          />

          {showSuggestions && filteredNames.length > 0 && (
            <FlatList
              data={filteredNames}
              keyExtractor={(item, index) => index.toString()}
              style={styles.suggestionsList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(item)}
                >
                  <Text style={styles.suggestionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={checkAnswer}
            activeOpacity={0.9}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          {feedback && (
            <Animated.Text
              style={[
                styles.feedback,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              {feedback}
            </Animated.Text>
          )}
        </View>
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
    shadowOpacity: 0.10,
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
  card: {
    marginTop: 10,
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
    marginBottom: 10,
  },
  suggestionsList: {
    maxHeight: 150,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "rgba(17,25,40,0.9)",
    borderWidth: 1,
    borderColor: "#11998e",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
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