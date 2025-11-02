import React, { useState } from 'react';
import LobbyScreen from './components/LobbyScreen';
import GameScreen from './components/GameScreen';
import { GameMode } from './types';

function App() {
  const [gameState, setGameState] = useState<'lobby' | 'playing'>('lobby');
  const [gameConfig, setGameConfig] = useState<{
    player1Name: string;
    player2Name: string;
    gameMode: GameMode;
  } | null>(null);

  const handleStartGame = (player1Name: string, player2Name: string, gameMode: GameMode) => {
    setGameConfig({ player1Name, player2Name, gameMode });
    setGameState('playing');
  };

  const handleQuit = () => {
    setGameConfig(null);
    setGameState('lobby');
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4 bg-grid">
       <style>
        {`
          .bg-grid {
            background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
            background-size: 3rem 3rem;
          }
        `}
      </style>
      <div className="w-full h-full flex items-center justify-center">
        {gameState === 'lobby' || !gameConfig ? (
          <LobbyScreen onStartGame={handleStartGame} />
        ) : (
          <GameScreen 
            player1Name={gameConfig.player1Name}
            player2Name={gameConfig.player2Name}
            gameMode={gameConfig.gameMode}
            onQuit={handleQuit}
          />
        )}
      </div>
    </main>
  );
}

export default App;
