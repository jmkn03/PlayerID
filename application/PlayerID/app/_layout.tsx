import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#2563EB" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="play/index" options={{ title: "Play" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="leaderboards" options={{ title: "Leaderboards" }} />
      <Stack.Screen name="guide" options={{ title: "Guide" }} />
      <Stack.Screen name="account/index" options={{ title: "Account" }} />
    </Stack>
  );
}
