import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import players from "../assets/data/allPlayers.json";

type Player = typeof players[number];

interface GameState {
  // shared
  player: Player | null;
  guess: string;
  feedback: string | null;
  showSuggestions: boolean;
  filteredNames: string[];
  allNames: string[];
  getRandomPlayer: () => void;
  handleInputChange: (text: string) => void;
  handleSuggestionPress: (name: string) => void;

  // mode 3 (quiz)
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
}

export const useGameStore = create<GameState>((set, get) => ({
  // shared
  player: null,
  guess: "",
  feedback: null,
  showSuggestions: false,
  filteredNames: [],
  allNames: players.map((p) => p.name),

  getRandomPlayer: () => {
    const randomIndex = Math.floor(Math.random() * players.length);
    set({
      player: players[randomIndex],
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
  // Mode 3 (Quiz) state
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
    const { player, guess, score, nextQuestion } = get();
    if (!player) return;
    if (guess.trim().toLowerCase() === player.name.toLowerCase()) {
      set({ feedback: "✅ Correct!", score: score + 1 });
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
      // update high score if needed
      const { mode2HighScore } = get();
      if (newScore > mode2HighScore) {
        set({ mode2HighScore: newScore });
        await AsyncStorage.setItem("SurvivalHighScore", String(newScore));
      }
      set({ guess: "", filteredNames: [] });
      setTimeout(() => get().getRandomPlayer(), 800); // <-- Add delay here!
    } else {
      set({ feedback: `❌ Wrong! Answer: ${player.name}`, gameOver: true });
      set({ guess: "", filteredNames: [] });
    }
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
