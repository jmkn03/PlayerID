import { useEffect } from "react";
import { Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useGameStore } from "../../utils/store";
import SuggestionsList from "../../components/SuggestionsList";
import { useRouter } from "expo-router";
import DailyCareerPath from "@/components/DailyCareerPath";

export default function Daily() {

  const router = useRouter();
  const {
    dailyPlayer,
    dailyCompleted,
    feedback,
    guess,
    loadDailyChallenge,
    handleInputChange,
    handleSuggestionPress,
    submitDailyAnswer,
  } = useGameStore();

  useEffect(() => {
    loadDailyChallenge();
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>🎯 Daily Challenge</Text>

      {dailyCompleted ? (
        <>
          
          <Text style={styles.message}>You’ve completed today’s challenge!</Text>
          {feedback && <Text style={styles.feedback}>{feedback}</Text>}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.submitButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </>
      ) : (
        dailyPlayer && (
          <>
            <DailyCareerPath/>
            <TextInput
              style={styles.input}
              placeholder="Enter player name..."
              placeholderTextColor="#b2fefa"
              value={guess}
              onChangeText={handleInputChange}
              onFocus={() => useGameStore.setState({ showSuggestions: true })}
            />
            <SuggestionsList />
            <TouchableOpacity style={styles.submitButton} onPress={submitDailyAnswer}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            {feedback && <Text style={styles.feedback}>{feedback}</Text>}
          </>
        )
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
  message: {
    fontSize: 18,
    color: "#b2fefa",
    marginBottom: 16,
    fontWeight: "600",
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