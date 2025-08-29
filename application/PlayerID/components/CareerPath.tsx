import { View, Text, StyleSheet } from "react-native";
import { useGameStore } from "../utils/store";

export default function CareerPath() {
  const { player } = useGameStore();

  if (!player || !player.career || player.career.length === 0) {
    return <Text style={styles.noData}>No career data available</Text>;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Career Path</Text>
      <View style={styles.careerTableHeader}>
        <Text style={[styles.headerCell, { flex: 2 }]}>Team</Text>
        <Text style={[styles.headerCell, { flex: 1 }]}>Years</Text>
      </View>
      {player.career.map((entry, index) => (
        <View key={index} style={styles.careerRow}>
          <Text style={[styles.cell, { flex: 2 }]}>{entry.team}</Text>
          <Text style={[styles.cell, { flex: 1 }]}>{entry.years}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
