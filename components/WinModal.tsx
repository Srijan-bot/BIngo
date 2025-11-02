import React from 'react';
import { playClickSound } from '../utils/sounds';

interface WinModalProps {
  winnerName: string;
  onPlayAgain: () => void;
  onQuit: () => void;
}

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute w-2 h-4" style={style}></div>
);

const Confetti: React.FC = () => {
    const pieces = Array.from({ length: 150 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animation: `fall ${Math.random() * 2 + 3}s linear ${Math.random() * 5}s infinite`,
            backgroundColor: ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'][Math.floor(Math.random() * 15)],
            transform: `rotate(${Math.random() * 360}deg)`,
        };
        return <ConfettiPiece key={i} style={style} />;
    });

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <style>
                {`
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                    }
                }
                `}
            </style>
            {pieces}
        </div>
    );
};


const WinModal: React.FC<WinModalProps> = ({ winnerName, onPlayAgain, onQuit }) => {
  const handlePlayAgain = () => {
    playClickSound();
    onPlayAgain();
  }

  const handleQuit = () => {
    playClickSound();
    onQuit();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <Confetti />
      <div className="bg-gray-900/80 rounded-2xl shadow-2xl p-8 text-center border-2 border-yellow-400 relative z-10 max-w-md w-full">
        <h2 className="text-4xl font-bold text-yellow-300 mb-4" style={{ textShadow: '0 0 10px #facc15' }}>🎉 Congratulations! 🎉</h2>
        <p className="text-2xl text-white mb-8">
          <span className="font-bold text-cyan-400">{winnerName}</span> wins the game!
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePlayAgain}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50"
          >
            Play Again
          </button>
          <button
            onClick={handleQuit}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;