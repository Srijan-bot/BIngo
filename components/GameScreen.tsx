import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, PlayerState, Board, Cell } from '../types';
import { generateBingoBoard, analyzeBoard } from '../utils/gameLogic';
import { getAIPersonalityResponse } from '../utils/ai';
import BingoBoard from './BingoBoard';
import WinModal from './WinModal';
import { playCallSound, playMarkSound, playTurnSound, playWinSound, playLoseSound } from '../utils/sounds';

interface GameScreenProps {
  player1Name: string;
  player2Name:string;
  gameMode: GameMode;
  onQuit: () => void;
}

const TURN_DURATION = 30;

const GameScreen: React.FC<GameScreenProps> = ({ player1Name, player2Name, gameMode, onQuit }) => {
  const [player1State, setPlayer1State] = useState<PlayerState>({
    name: player1Name,
    board: generateBingoBoard(),
    lines: 0,
    hearts: 3,
  });
  const [player2State, setPlayer2State] = useState<PlayerState>({
    name: player2Name,
    board: generateBingoBoard(),
    lines: 0,
    hearts: 3,
  });
  const [calledNumbers, setCalledNumbers] = useState<Set<number>>(new Set());
  const [lastCalled, setLastCalled] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState<string | null>(null);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [timer, setTimer] = useState(TURN_DURATION);

  const isAIsTurn = gameMode === GameMode.PVA && currentPlayer === 2;

  const handleCellClick = (num: number) => {
    // The BingoBoard component's `isCurrentTurn` prop already prevents clicks when it's not the player's turn.
    // This guard is a final check against clicking marked numbers or acting after a win.
    if (winner || calledNumbers.has(num)) {
      return;
    }
    
    playCallSound();
    setCalledNumbers(new Set(calledNumbers).add(num));
    setLastCalled(num);
    setTimer(TURN_DURATION); // Reset timer on action
  };

  const updateBoard = (board: Board, num: number, winningCells: Set<string>): Board => {
    return board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const newCell: Cell = { ...cell };
        if (cell.number === num) {
          if (!cell.marked) playMarkSound();
          newCell.marked = true;
        }
        newCell.isWinningCell = winningCells.has(`${rowIndex}-${colIndex}`);
        return newCell;
      })
    );
  };
  
  useEffect(() => {
    if (lastCalled === null) return;
    
    // Analyze and update Player 1
    const p1Analysis = analyzeBoard(player1State.board.map(row => row.map(cell => cell.number === lastCalled ? {...cell, marked: true} : cell)));
    const newP1Board = updateBoard(player1State.board, lastCalled, p1Analysis.winningCells);
    setPlayer1State(prevState => ({ ...prevState, board: newP1Board, lines: p1Analysis.lines }));

    // Analyze and update Player 2
    const p2Analysis = analyzeBoard(player2State.board.map(row => row.map(cell => cell.number === lastCalled ? {...cell, marked: true} : cell)));
    const newP2Board = updateBoard(player2State.board, lastCalled, p2Analysis.winningCells);
    setPlayer2State(prevState => ({ ...prevState, board: newP2Board, lines: p2Analysis.lines }));

    if (p1Analysis.lines >= 5) {
      setWinner(player1Name);
      playWinSound();
    } else if (p2Analysis.lines >= 5) {
      setWinner(player2Name);
      if (gameMode === GameMode.PVA) playLoseSound();
      else playWinSound();
    } else {
      playTurnSound();
      setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    }
  }, [lastCalled]);
  
  // AI Turn Logic
  useEffect(() => {
    const fetchAIResponse = async () => {
        setIsAiThinking(true);
        const response = await getAIPersonalityResponse(player2State, player1State, lastCalled, isAIsTurn);
        setAiMessage(response);
        setIsAiThinking(false);
    }

    if (gameMode === GameMode.PVA && lastCalled) {
        fetchAIResponse();
    }
    
    if (isAIsTurn && !winner) {
        const aiTurnTimeout = setTimeout(() => {
          const unmarkedCells: Cell[] = [];
          player2State.board.forEach(row => {
              row.forEach(cell => {
                  if (!cell.marked) {
                      unmarkedCells.push(cell);
                  }
              });
          });

          if (unmarkedCells.length > 0) {
              const choice = unmarkedCells[Math.floor(Math.random() * unmarkedCells.length)];
              handleCellClick(choice.number);
          }
        }, 2000 + Math.random() * 1000); // AI "thinks" for 2-3 seconds
        return () => clearTimeout(aiTurnTimeout);
    }
  }, [isAIsTurn, winner, gameMode, player1State, player2State, lastCalled]);

  // Timer logic
  useEffect(() => {
    if (winner) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          handleTimeout();
          return TURN_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer, winner]);

  const handleTimeout = () => {
    playLoseSound();
    if (currentPlayer === 1) {
      const newHearts = player1State.hearts - 1;
      setPlayer1State(p => ({ ...p, hearts: newHearts }));
      if (newHearts <= 0) {
        setWinner(player2Name);
        if (gameMode === GameMode.PVA) playLoseSound();
        else playWinSound();
      }
    } else { // Player 2 (human)
      const newHearts = player2State.hearts - 1;
      setPlayer2State(p => ({ ...p, hearts: newHearts }));
      if (newHearts <= 0) {
        setWinner(player1Name);
        playWinSound();
      }
    }
    setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    playTurnSound();
  };


  const handlePlayAgain = () => {
    setPlayer1State({ name: player1Name, board: generateBingoBoard(), lines: 0, hearts: 3 });
    setPlayer2State({ name: player2Name, board: generateBingoBoard(), lines: 0, hearts: 3 });
    setCalledNumbers(new Set());
    setLastCalled(null);
    setCurrentPlayer(1);
    setWinner(null);
    setAiMessage('');
    setTimer(TURN_DURATION);
  };

  const currentTurnName = currentPlayer === 1 ? player1Name : player2Name;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      {winner && <WinModal winnerName={winner} onPlayAgain={handlePlayAgain} onQuit={onQuit} />}

      <div className="text-center mb-6">
        <div className="relative w-48 h-10 mx-auto mb-2 flex items-center justify-center">
            {!winner && (
                <>
                <div className="absolute top-0 left-0 h-full bg-cyan-500/50 rounded-full" style={{ width: `${(timer / TURN_DURATION) * 100}%`, transition: 'width 1s linear' }}></div>
                <div className="relative text-lg font-mono">{timer}s</div>
                </>
            )}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
           {winner ? 'Game Over!' : isAIsTurn ? `${player2Name}'s Turn` : `Your Turn, ${player1Name}`}
        </h2>
        <p className="text-lg text-cyan-300">Last Called: {lastCalled ?? 'N/A'}</p>
        <div className="flex justify-center items-center h-10 mt-2">
            {gameMode === GameMode.PVA && (
              <div className="bg-gray-800/60 rounded-full px-4 py-2 text-cyan-300 italic">
                {isAiThinking ? 'Gemini is thinking...' : aiMessage}
              </div>
            )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-around items-start gap-6 mb-6">
        <BingoBoard 
            player={player1State}
            isCurrentTurn={currentPlayer === 1 && !winner}
            onCellClick={handleCellClick}
        />
        <BingoBoard 
            player={player2State}
            isCurrentTurn={currentPlayer === 2 && !winner}
            onCellClick={gameMode === GameMode.PVP ? handleCellClick : undefined}
        />
      </div>
    </div>
  );
};

export default GameScreen;