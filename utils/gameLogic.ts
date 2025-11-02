import { Board, Cell } from '../types';

const BOARD_SIZE = 5;

const generateUniqueRandoms = (count: number, min: number, max: number): number[] => {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(numbers);
};

export const generateBingoBoard = (): Board => {
  const board: Board = Array.from({ length: BOARD_SIZE }, () => []);
  const flatNumbers = generateUniqueRandoms(BOARD_SIZE * BOARD_SIZE, 1, 25);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = { 
        number: flatNumbers[row * BOARD_SIZE + col], 
        marked: false, 
        isWinningCell: false 
      };
    }
  }

  return board;
};

export const analyzeBoard = (board: Board): { lines: number; winningCells: Set<string> } => {
  let lines = 0;
  const winningCells = new Set<string>();
  
  // Check rows
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[i].every(cell => cell.marked)) {
      lines++;
      for (let j = 0; j < BOARD_SIZE; j++) winningCells.add(`${i}-${j}`);
    }
  }

  // Check columns
  for (let j = 0; j < BOARD_SIZE; j++) {
    if (board.every(row => row[j].marked)) {
      lines++;
      for (let i = 0; i < BOARD_SIZE; i++) winningCells.add(`${i}-${j}`);
    }
  }

  // Check diagonal from top-left to bottom-right
  if (board.every((row, i) => row[i].marked)) {
    lines++;
    for (let i = 0; i < BOARD_SIZE; i++) winningCells.add(`${i}-${i}`);
  }

  // Check diagonal from top-right to bottom-left
  if (board.every((row, i) => row[BOARD_SIZE - 1 - i].marked)) {
    lines++;
    for (let i = 0; i < BOARD_SIZE; i++) winningCells.add(`${i}-${BOARD_SIZE - 1 - i}`);
  }

  return { lines, winningCells };
};