import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const careerMenu = [
  { years: "2025–", club: "Kick Off", color: "#11998e", route: "/play", icon: "⚽" },
  { years: "2023–2025", club: "Leaderboards", color: "#2563eb", route: "/leaderboards", icon: "🏆" },
  { years: "2021–2023", club: "Settings", color: "#6366f1", route: "/settings", icon: "⚙️" },
  { years: "2020–2021", club: "Profile", color: "#f43f5e", route: "/account", icon: "👤" },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.topDecor}>
          <Text style={styles.logoIcon}>🪪</Text>
          <Text style={styles.title}>PlayerID</Text>
          <Text style={styles.subtitle}>Ultimate Football Quiz</Text>
        </View>

        <TouchableOpacity
          style={styles.kickOffButton}
          onPress={() => router.push("/play/daily")}
        >
          <Text style={styles.kickOffButtonText}>🎯 Daily Challenge</Text>
        </TouchableOpacity>

        {/* Play Button */}
        <TouchableOpacity
          style={styles.kickOffButton}
          activeOpacity={0.9}
          onPress={() => router.push("/play")}
        >
          <LinearGradient
            colors={["#22C55E", "#16A34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.kickOffGradient}
          >
            <Text style={styles.kickOffButtonText}>PLAY</Text>
            <Text style={styles.kickOffButtonIcon}>⚽</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Career Path */}
        <View style={styles.careerSection}>
          <Text style={styles.careerTitle}>Career Path</Text>
          <View style={styles.careerTableHeader}>
            <Text style={[styles.headerCell, { flex: 1.2 }]}>Years</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Team</Text>
          </View>
          <ScrollView style={{ maxHeight: width * 0.7 }}>
            {careerMenu.slice(1).map((item, idx) => (
              <TouchableOpacity
                key={item.club}
                style={[
                  styles.careerRow,
                  {
                    backgroundColor:
                      idx % 2 === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                  },
                ]}
                activeOpacity={0.85}
                onPress={() => router.push(item.route)}
              >
                <Text style={[styles.cell, { flex: 1.2, color: "#b2fefa" }]}>
                  {item.years}
                </Text>
                <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
                  <View style={[styles.clubIcon, { backgroundColor: item.color }]}>
                    <Text style={styles.clubIconText}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.cell, styles.clubName]}>{item.club}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.footer}>⚽ Ready to become a legend?</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 18,
  },
  topDecor: { alignItems: "center", marginTop: 24, marginBottom: 10 },
  logoIcon: {
    fontSize: 42,
    marginBottom: 6,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textShadowColor: "#11998e",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#b2fefa",
    marginTop: 2,
    marginBottom: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  kickOffButton: {
    borderRadius: 36,
    marginVertical: 18,
    elevation: 5,
    shadowColor: "#22C55E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  kickOffGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    paddingVertical: 20,
    paddingHorizontal: 48,
  },
  kickOffButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 14,
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  kickOffButtonIcon: { fontSize: 32 },
  careerSection: {
    width: width * 0.92,
    backgroundColor: "rgba(22,34,42,0.85)",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#11998e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    alignSelf: "center",
    maxHeight: width * 1.1,
  },
  careerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
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
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    marginBottom: 3,
  },
  cell: { fontSize: 16, fontWeight: "500", color: "#fff", letterSpacing: 0.5 },
  clubIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  clubIconText: { fontSize: 18 },
  clubName: { fontSize: 17, fontWeight: "600", color: "#fff", letterSpacing: 1 },
  footer: {
    color: "#b2fefa",
    fontSize: 16,
    marginTop: 14,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
    textShadowColor: "#16222A",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
