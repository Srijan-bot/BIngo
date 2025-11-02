export enum GameMode {
  PVP = 'PVP',
  PVA = 'PVA',
}

export interface Cell {
  number: number;
  marked: boolean;
  isWinningCell: boolean;
}

export type Board = Cell[][];

export interface PlayerState {
  name: string;
  board: Board;
  lines: number;
  hearts: number;
}