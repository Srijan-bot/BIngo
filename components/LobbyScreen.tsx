import React, { useState } from 'react';
import { GameMode } from '../types';
import { playClickSound } from '../utils/sounds';

interface LobbyScreenProps {
  onStartGame: (player1Name: string, player2Name: string, gameMode: GameMode) => void;
}

const LobbyScreen: React.FC<LobbyScreenProps> = ({ onStartGame }) => {
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.PVP);

  const isAI = gameMode === GameMode.PVA;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    const p2Name = isAI ? 'Gemini AI' : player2Name.trim();
    if (player1Name.trim() && p2Name) {
      onStartGame(player1Name.trim(), p2Name, gameMode);
    }
  };

  const handleModeChange = (mode: GameMode) => {
    playClickSound();
    setGameMode(mode);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-cyan-500/20">
      <h2 className="text-3xl font-bold text-center text-white mb-6">Create a Game</h2>
      
      <div className="flex justify-center mb-6 bg-gray-900/50 p-1 rounded-lg border border-gray-700">
        <button 
          onClick={() => handleModeChange(GameMode.PVP)}
          className={`px-6 py-2 w-1/2 rounded-md text-sm font-medium transition-all duration-300 ${gameMode === GameMode.PVP ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
        >
          Player vs Player
        </button>
        <button 
          onClick={() => handleModeChange(GameMode.PVA)}
          className={`px-6 py-2 w-1/2 rounded-md text-sm font-medium transition-all duration-300 ${gameMode === GameMode.PVA ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700/50'}`}
        >
          Player vs AI
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="player1" className="block text-sm font-medium text-cyan-300 mb-2">
            Your Name
          </label>
          <input
            id="player1"
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="player2" className="block text-sm font-medium text-cyan-300 mb-2">
            {isAI ? 'Opponent' : 'Player 2 Name'}
          </label>
          <input
            id="player2"
            type="text"
            value={isAI ? 'Gemini AI' : player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            required
            disabled={isAI}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50"
        >
          Start Game
        </button>
      </form>
    </div>
  );
};

export default LobbyScreen;