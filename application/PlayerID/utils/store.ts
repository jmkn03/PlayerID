import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import players from "../assets/data/allPlayers.json";

type Player = typeof players[number];
type Difficulty = "Easy" | "Medium" | "Hard";

interface GameState {
  // shared
  player: Player | null;
  guess: string;
  feedback: string | null;
  showSuggestions: boolean;
  filteredNames: string[];
  allNames: string[];
  difficulty: Difficulty | null; // 🔹 new
  setDifficulty: (level: Difficulty) => void; // 🔹 new
  getRandomPlayer: () => void;
  handleInputChange: (text: string) => void;
  handleSuggestionPress: (name: string) => void;

  // mode 3 (quiz/classic)
  score: number;
  question: number;
  totalQuestions: number;
  gameOver: boolean;
  nextQuestion: () => void;
  checkAnswer: () => void;
  restartGame: () => void;

  // mode 2 (survival)
  mode2Score: number;
  mode2HighScore: number;
  startMode2: () => void;
  submitMode2Answer: () => void;

  // mode 1 (daily)
  dailyPlayer: Player | null;
  dailyCompleted: boolean;
  dailyDate: string | null;
  loadDailyChallenge: () => Promise<void>;
  submitDailyAnswer: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // shared
  player: null,
  guess: "",
  feedback: null,
  showSuggestions: false,
  filteredNames: [],
  allNames: players.map((p) => p.name),
  difficulty: null,

  setDifficulty: (level) => set({ difficulty: level }),

  getRandomPlayer: () => {
    const { difficulty } = get();
    let pool = players;

    if (difficulty) {
      pool = players.filter((p) => p.difficulty?.level === difficulty);
    }

    if (pool.length === 0) return;

    const randomIndex = Math.floor(Math.random() * pool.length);
    set({
      player: pool[randomIndex],
      guess: "",
      feedback: null,
      showSuggestions: false,
      filteredNames: [],
    });
  },

  handleInputChange: (text: string) => {
    const allNames = get().allNames;
    set({ guess: text });
    if (text.length > 0) {
      const filtered = allNames.filter((name) =>
        name.toLowerCase().includes(text.toLowerCase())
      );
      set({ filteredNames: filtered.slice(0, 6), showSuggestions: true });
    } else {
      set({ showSuggestions: false });
    }
  },

  handleSuggestionPress: (name: string) => {
    set({ guess: name, showSuggestions: false });
  },

  // ----------------------
  // Mode 3 (Quiz/Classic) state
  // ----------------------
  score: 0,
  question: 1,
  totalQuestions: 2,
  gameOver: false,

  nextQuestion: () => {
    const { question, totalQuestions, getRandomPlayer } = get();
    if (question === totalQuestions) {
      set({ gameOver: true });
      return;
    }
    if (question < totalQuestions) {
      set({ question: question + 1 });
      getRandomPlayer();
    } else {
      set({ question: 1 });
      getRandomPlayer();
    }
  },

  checkAnswer: () => {
    const { player, guess, score, nextQuestion, difficulty } = get();
    if (!player) return;

    const correct = guess.trim().toLowerCase() === player.name.toLowerCase();
    let points = 0;

    if (correct) {
      if (difficulty === "Hard") points = 3;
      else if (difficulty === "Medium") points = 2;
      else points = 1;

      set({ feedback: "✅ Correct!", score: score + points });
    } else {
      set({ feedback: `❌ Wrong! Answer: ${player.name}` });
    }

    set({ guess: "", filteredNames: [] });
    setTimeout(() => nextQuestion(), 800);
  },

  restartGame: () => {
    set({
      score: 0,
      question: 1,
      gameOver: false,
      feedback: null,
    });
    get().getRandomPlayer();
  },

  // ----------------------
  // Mode 2 (Survival) state
  // ----------------------
  mode2Score: 0,
  mode2HighScore: 0,

  startMode2: () => {
    set({
      mode2Score: 0,
      gameOver: false,
      feedback: null,
      guess: "",
      filteredNames: [],
    });
    get().getRandomPlayer();
  },

  submitMode2Answer: async () => {
    const { player, guess, mode2Score } = get();
    if (!player) return;

    if (guess.trim().toLowerCase() === player.name.toLowerCase()) {
      const newScore = mode2Score + 1;
      set({ feedback: "✅ Correct!", mode2Score: newScore });

      const { mode2HighScore } = get();
      if (newScore > mode2HighScore) {
        set({ mode2HighScore: newScore });
        await AsyncStorage.setItem("SurvivalHighScore", String(newScore));
      }

      set({ guess: "", filteredNames: [] });
      setTimeout(() => get().getRandomPlayer(), 800);
    } else {
      set({ feedback: `❌ Wrong! Answer: ${player.name}`, gameOver: true });
      set({ guess: "", filteredNames: [] });
    }
  },

  // ----------------------
  // Mode 1 (Daily Challenge)
  // ----------------------
  dailyPlayer: null,
  dailyCompleted: false,
  dailyDate: null,

  loadDailyChallenge: async () => {
    const today = new Date().toISOString().slice(0, 10); // e.g. "2025-09-12"

    // check if already completed
    const completed = await AsyncStorage.getItem(`Daily_${today}`);
    const seed = parseInt(today.replace(/-/g, ""), 10);
    const index = seed % players.length;
    const player = players[index];

    set({
      dailyPlayer: player,
      dailyCompleted: !!completed,
      dailyDate: today,
      guess: "",
      feedback: null,
      filteredNames: [],
      showSuggestions: false,
    });
  },

  submitDailyAnswer: async () => {
    const { dailyPlayer, guess, dailyDate } = get();
    if (!dailyPlayer || !dailyDate) return;

    if (guess.trim().toLowerCase() === dailyPlayer.name.toLowerCase()) {
      set({ feedback: "✅ Correct!", dailyCompleted: true });
      await AsyncStorage.setItem(`Daily_${dailyDate}`, "done");
    } else {
      set({ feedback: `❌ Wrong! Answer: ${dailyPlayer.name}`, dailyCompleted: true });
      await AsyncStorage.setItem(`Daily_${dailyDate}`, "done");
    }

    set({ guess: "", filteredNames: [] });
  },
}));

// Load high score on app start
(async () => {
  try {
    const saved = await AsyncStorage.getItem("SurvivalHighScore");
    if (saved) {
      useGameStore.setState({ mode2HighScore: parseInt(saved, 10) });
    }
  } catch (err) {
    console.error("Error loading high score", err);
  }
})();
  