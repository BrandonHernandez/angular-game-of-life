import { Injectable, signal, Signal, WritableSignal, computed, inject } from '@angular/core';
import { ToolFunctionsService } from './tool-functions.service';

type Cell = 1 | 0;
type CellMap = Cell[][];

@Injectable({ providedIn: 'root' })
export class GameDataService {
  private tools = inject(ToolFunctionsService);

  readonly cellMap: WritableSignal<CellMap> = signal([]);
  private nextCellMap: CellMap = [];

  private intervalID = 0;
  readonly gameRunning: WritableSignal<boolean> = signal(false);
  readonly isGameRunning = computed(() => this.gameRunning());

  readonly maxTickRate = 2500;
  readonly minTickRate = 0;

  readonly tickRate = signal(this.minTickRate);

  private _selectedRow = 0;
  private _selectedCol = 0;

  public get selectedRow() {
    return this._selectedRow;
  }

  public get selectedCol() {
    return this._selectedCol;
  }

  public set selectedRow(selectedRow: number) {
    this._selectedRow = selectedRow;
  }

  public set selectedCol(selectedCol: number) {
    this._selectedCol = selectedCol;
  }

  readonly message: WritableSignal<{ content: string, origin: string } | null> = signal(null);

  constructor() {
    this.message.set({content: 'game of life', origin: 'game-data-service'});
  }

  saveMap() {
    localStorage.setItem('cellMap', JSON.stringify(this.cellMap()));
  }

  loadMap() {
    const cellMap = localStorage.getItem('cellMap');
    if (cellMap) {
      this.cellMap.set(JSON.parse(cellMap));
    }
  }

  clearMap() {
    this.cellMap.set(this.newMap(this.cellMap().length, this.cellMap()[0].length));
  }

  play() {
    this.intervalID = setInterval(() => this.tick(), this.tickRate());
    this.gameRunning.set(true);
  }

  stop() {
    clearInterval(this.intervalID);
    this.gameRunning.set(false);
  }

  stepFwd() {
    this.tick();
  }

  initMap(rows: number, cols: number) {
    this.cellMap.set(this.newMap(rows, cols));
  }

  newMap(rows: number, cols: number): CellMap {
    const cellMap: CellMap = [];
    for (let row = 0; row < rows; row++) {
      const row: Cell[] = Array(cols).fill(0 as Cell);
      cellMap.push(row);
    }
    return cellMap;
  }

  tick() {
    this.nextCellMap = this.newMap(this.cellMap().length, this.cellMap()[0].length);
    for (let row = 0; row < this.cellMap().length; row++) {
      for (let col = 0; col < this.cellMap()[row].length; col++) {
        this.computeNextGen(row, col, this.countNeighbors(row, col));
      }
    }
    this.cellMap.set(this.nextCellMap);
  }

  countNeighbors(row: number, col: number): number {
    let neighbors = 0;

    const rowLen = this.cellMap().length;
    const colLen = this.cellMap()[0].length;

    // [i-1,j-1]  [i-1,_j_]  [i-1,j+1]
    // [_i_,j-1]  [_i_,_j_]  [_i_,j+1]
    // [i+1,j-1]  [i+1,_j_]  [i+1,j+1]

    const neighboringRowIndices = [
      this.tools.confine(row - 1, rowLen),
      row,
      this.tools.confine(row + 1, rowLen),
    ];
    const neighboringColIndices = [
      this.tools.confine(col - 1, colLen),
      col,
      this.tools.confine(col + 1, colLen),
    ];

    neighboringRowIndices.forEach((rowItem) => {
      neighboringColIndices.forEach((colItem) => {
        if (this.cellMap()[rowItem][colItem] && !(rowItem === row && colItem === col)) {
          neighbors++;
        }
      });
    });

    return neighbors;
  }

  computeNextGen(row: number, col: number, neighbors: number) {
    if (this.cellMap()[row][col]) {
      if (neighbors < 2) {
        // 1. Any live cell with fewer than 2 live neighbors dies, as if by underpopulation.
        this.nextCellMap[row][col] = 0 as Cell;
      } else if (neighbors === 2 || neighbors === 3) {
        // 2. Any live cell with 2 or 3 live neighbors lives on to the next generation.
        this.nextCellMap[row][col] = 1 as Cell;
      } else {
        // 3. Any live cell with more than 3 live neighbors dies, as if by overpopulation.
        this.nextCellMap[row][col] = 0 as Cell;
      }
    } else if (neighbors === 3) {
      // 4. Any dead cell with exactly 3 live neighbors becomes a live cell, as if by reproduction.
      this.nextCellMap[row][col] = 1 as Cell;
    }
  }

  flipCell() {
    this.cellMap.update((cellMap) => {
      cellMap[this.selectedRow][this.selectedCol] = cellMap[this.selectedRow][this.selectedCol]
        ? 0
        : 1;
      return cellMap;
    });
  }

  onTickRateChange(tickRate: number) {
    this.tickRate.set(this.maxTickRate - tickRate);
    if (this.isGameRunning()) {
      this.stop();
      this.play();
    }
  }

  addRow() {
    this.cellMap.update((cellMap) => [...cellMap, Array(cellMap[0].length).fill(0)]);
    this.message.set({ content: '[+] Added row', origin: 'game-data-service' });
  }

  remRow() {
    this.cellMap.update((cellMap) => {
      const _cellMap = [...cellMap];
      _cellMap.pop()
      return _cellMap;
    });
    this.message.set({ content: '[-] Removed row', origin: 'game-data-service' });
  }

  addColumn() {
    this.cellMap.update((cellMap) => {
      const _cellMap = [...cellMap];
      _cellMap.forEach((_row) => _row.push(0 as Cell));
      return _cellMap;
    });
    this.message.set({ content: '[+] Added column', origin: 'game-data-service' });
  }

  remColumn() {
    this.cellMap.update((cellMap) => {
      const _cellMap = [...cellMap];
      _cellMap.forEach((_row) => _row.pop());
      return _cellMap;
    });
    this.message.set({ content: '[-] Removed column', origin: 'game-data-service' });

  }

  setCoordinates(row: number, col: number) {
    this.selectedRow = row;
    this.selectedCol = col;
  }

}
