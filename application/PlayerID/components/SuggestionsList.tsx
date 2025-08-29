import { FlatList, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useGameStore } from "../utils/store";

export default function SuggestionsList() {
  const { showSuggestions, filteredNames, handleSuggestionPress } = useGameStore();

  if (!showSuggestions || filteredNames.length === 0) return null;

  return (
    <View style={styles.suggestionsWrapper}>
      <FlatList
        data={filteredNames}
        keyExtractor={(item, index) => index.toString()}
        style={styles.suggestionsList}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSuggestionPress(item)}
          >
            <Text style={styles.suggestionText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  suggestionsWrapper: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  suggestionsList: {
    maxHeight: 150,
    borderRadius: 8,
    backgroundColor: "rgba(17,25,40,0.9)",
    borderWidth: 1,
    borderColor: "#11998e",
    width: "100%",
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
});