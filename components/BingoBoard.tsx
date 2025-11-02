import React from 'react';
import { PlayerState } from '../types';

interface BingoBoardProps {
  player: PlayerState;
  isCurrentTurn: boolean;
  onCellClick?: (number: number) => void;
}

const BingoBoard: React.FC<BingoBoardProps> = ({ player, isCurrentTurn, onCellClick }) => {
  return (
    <div className={`p-4 rounded-lg shadow-lg transition-all duration-300 ${isCurrentTurn ? 'bg-cyan-900/50 border-2 border-cyan-400 shadow-cyan-500/20' : 'bg-gray-800/50 border border-gray-700'}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white">{player.name}</h3>
        <div className="flex justify-center items-center gap-4 text-sm mt-1">
          <span className="text-cyan-300">Lines: {player.lines}</span>
          <div className="flex gap-1 items-center">
            <span className="text-red-400">Hearts:</span>
            {'❤️'.repeat(player.hearts)}
            {'🖤'.repeat(3 - player.hearts)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {player.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isClickable = isCurrentTurn && !cell.marked && onCellClick;
            
            const cellStyle = cell.isWinningCell
              ? 'bg-yellow-400 text-gray-900 ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-300 scale-110 shadow-lg'
              : cell.marked
              ? 'bg-cyan-500 text-white scale-105'
              : 'bg-gray-700 text-white';
            
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => isClickable && onCellClick(cell.number)}
                className={`w-14 h-14 flex items-center justify-center text-lg font-bold rounded-md transition-all duration-300 ${cellStyle}
                  ${isClickable ? 'cursor-pointer hover:bg-cyan-600' : 'cursor-default'}
                `}
              >
                {cell.number}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BingoBoard;