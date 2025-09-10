import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useEffect, useRef } from "react";
import { useGameStore } from "../utils/store";

export default function CareerPath() {
  const { player } = useGameStore();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [player?.id]);

  if (!player) return null;

  return (
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
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <View style={{ marginBottom: 10 }}>
          {player.career?.length === 0 ? (
            <Text style={styles.noData}>No career data available</Text>
          ) : (
            player.career?.map((step: any, index: number) => (
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
