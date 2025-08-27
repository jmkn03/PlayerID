import { create } from "zustand";
import players from "../assets/data/allPlayers.json";

type Player = typeof players[number];

interface GameState {
  player: Player | null;
  guess: string;
  feedback: string | null;
  score: number;
  question: number;
  gameOver: boolean;
  showSuggestions: boolean;
  filteredNames: string[];
  allNames: string[];
  getRandomPlayer: () => void;
  nextQuestion: () => void;
  checkAnswer: () => void;
  handleInputChange: (text: string) => void;
  handleSuggestionPress: (name: string) => void;
  restartGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  player: null,
  guess: "",
  feedback: null,
  score: 0,
  question: 1,
  gameOver: false,
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

  nextQuestion: () => {
    const { question, getRandomPlayer } = get();
    if (question === 2) {
      set({ gameOver: true });
      return;
    }
    if (question < 2) {
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
    setTimeout(() => {
      nextQuestion();
    }, 800);
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

  restartGame: () => {
    set({
      score: 0,
      question: 1,
      gameOver: false,
      feedback: null,
    });
    get().getRandomPlayer();
  },
}));