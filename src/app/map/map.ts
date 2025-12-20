import { Component, WritableSignal, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Cell {
  id: number,
  state: boolean,
}

@Component({
  selector: 'app-map',
  imports: [FormsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {

  public cellMap: WritableSignal<Cell[][]> = signal([]);
  private nextCellMap: WritableSignal<Cell[][]> = signal([]);

  public rows = computed(() => this.cellMap().length);
  public cols = computed(() => this.cellMap()[0].length);

  public trackRow = (i: number) => i;
  public trackCell = (i: number) => i;

  private intervalID = 0;
  private playing = false;

  public tickRateRaw = signal(900);
  public tickRate = computed(() => 1000 - this.tickRateRaw());

  public constructor() {
    this.initMap(40, 40);
  }

  private initMap(rows: number, cols: number) {
    this.cellMap = signal([]);
    let _uniqueId = 0;
    for (let i = 0; i < rows; i++) {
      let _row: Cell[] = [];
      for (let j = 0; j < cols; j++) {
        _row.push({
          id: _uniqueId++,
          state: false,
        });
      }
      this.cellMap().push(_row);
    }
  }

  public get isPlaying() {
    return this.playing;
  }

  public set isPlaying(playing: boolean) {
    this.playing = playing;
  }

  public play() {
    this.intervalID = setInterval(() => {
      this.developUniverse();
    }, this.tickRate());
    this.isPlaying = true;
  }

  public stop() {
    clearInterval(this.intervalID);
    this.isPlaying = false;
  }

  public stepFwd() {
    this.developUniverse();
  }

  public initNextMap() {
    this.nextCellMap = signal([]);
    let _uid = 0;

    for (let i = 0; i < this.cellMap().length; i++) {
      let _row: Cell[] = [];
      for (let j = 0; j < this.cellMap()[i].length; j++) {
        // It is important that a new instance of Cell is created for each cell.
        // Originally I had this line outside the for loops, and so the same instance
        // was getting pushed into the row, so it was an array of clones!!!
        let newCellObject: Cell = { id: _uid++, state: false };
        _row.push(newCellObject);
      }
      this.nextCellMap().push(_row);
    }
  }

  public saveMap() {
    localStorage.setItem("cellMap", JSON.stringify(this.cellMap()));
    console.log("Map saved!");
  }

  public loadMap() {
    const cellMap = localStorage.getItem("cellMap");
    if (cellMap) {
      this.cellMap.set(JSON.parse(cellMap));
    }
  }

  public clearMap() {
    console.log(`Rows: ${ this.rows() }`);
    console.log(`Cols: ${ this.cols() }`);
    this.initMap(this.rows(), this.cols());
  }

  public developUniverse() {
    // let newCellMap = this.initNextMap();

    this.initNextMap();

    for (let i = 0; i < this.cellMap().length; i++) {
      for (let j = 0; j < this.cellMap()[i].length; j++) {
        let neighbors = this.countNeighbors(i, j);
        // console.log('Current neighbors: ' + neighbors);
        this.computeNextGen(i, j, neighbors);
      }
    }

    // this.cellMap = this.nextCellMap;
    // No, redraw original map with newCellMap data instead.
    // This avoids duplicate tracking ids.
    // for (let i = 0; i < this.nextCellMap().length; i++) {
    //   for (let j = 0; j < this.nextCellMap()[i].length; j++) {
    //     this.cellMap()[i][j].state = this.nextCellMap()[i][j].state;
    //   }
    // }
    // UPDATE: using $index for tracking. Using object.id caused the aforementioned problem, but
    // not anymore...
    this.cellMap.set(this.nextCellMap());

  }

  public countNeighbors(i: number, j: number): number {
    const iMax = this.cellMap().length - 1;
    const jMax = this.cellMap()[i].length - 1;

    let iDynamic = 0;
    let jDynamic = 0;

    let neighbors = 0;

    // [i-1,j-1]  [i-1,_j_]  [i-1,j+1]
    // [_i_,j-1]  [_i_,_j_]  [_i_,j+1]
    // [i+1,j-1]  [i+1,_j_]  [i+1,j+1]

    // [i-1,j-1] : NW
    // [i-1,_j_] : N
    // [i-1,j+1] : NE

    // [_i_,j-1] : W
    // [_i_,j+1] : E

    // [i+1,j-1] : SW
    // [i+1,_j_] : S
    // [i+1,j+1] : SE

    // [i-1,j-1] : NW
    iDynamic = (i - 1 < 0) ? iMax : i - 1;
    jDynamic = (j - 1 < 0) ? jMax : j - 1;
    if (this.cellMap()[iDynamic][jDynamic].state) {
      neighbors++;
    }

    // [i-1,_j_] : N
    iDynamic = (i - 1 < 0) ? iMax : i - 1;
    jDynamic = j;
    if (this.cellMap()[iDynamic][jDynamic].state) {
      neighbors++;
    }

    // [i-1,j+1] : NE
    iDynamic = (i - 1 < 0) ? iMax : i - 1;
    jDynamic = (j + 1 > jMax) ? 0 : j + 1;
    if (this.cellMap()[iDynamic][jDynamic].state) {
      neighbors++;
    }

    // [_i_,j-1] : W
    iDynamic = i;
    jDynamic = (j - 1 < 0) ? jMax : j - 1;
    if (this.cellMap()[iDynamic][jDynamic].state) {
      neighbors++;
    }

    // [_i_,j+1] : E
    iDynamic = i;
    jDynamic = (j + 1 > jMax) ? 0 : j + 1;
    if (this.cellMap()[iDynamic][jDynamic].state) {
      neighbors++;
    }

    // [i+1,j-1] : SW
    iDynamic = (i + 1 > iMax) ? 0 : i + 1;
    jDynamic = (j - 1 < 0) ? jMax : j - 1;
    if (this.cellMap()[iDynamic][jDynamic].state) {
      neighbors++;
    }

    // [i+1,_j_] : S
    iDynamic = (i + 1 > iMax) ? 0 : i + 1;
    jDynamic = j;
    if (this.cellMap()[iDynamic][jDynamic].state) {
      neighbors++;
    }

    // [i+1,j+1] : SE   
    iDynamic = (i + 1 > iMax) ? 0 : i + 1;
    jDynamic = (j + 1 > jMax) ? 0 : j + 1;
    if (this.cellMap()[iDynamic][jDynamic].state) {
      neighbors++;
    }

    return neighbors;
  }

  public computeNextGen(i: number, j: number, neighbors: number) {
    if (this.cellMap()[i][j].state) {
      // 1. Any live cell with fewer than 2 live neighbors dies, as if by underpopulation.
      if (neighbors < 2) {
        this.nextCellMap()[i][j].state = false;
      }
      // 2. Any live cell with 2 or 3 live neighbors lives on to the next generation.
      if (neighbors === 2 || neighbors === 3) {
        this.nextCellMap()[i][j].state = true;
      }
      // 3. Any live cell with more than 3 live neighbors dies, as if by overpopulation.
      if (neighbors > 3) {
        this.nextCellMap()[i][j].state = false;
      }
    } else {
      // 4. Any dead cell with exactly 3 live neighbors becomes a live cell, as if by reproduction.
      if (neighbors === 3) {
        this.nextCellMap()[i][j].state = true;
      }
    }
  }

  public onCellClick(row: number, col: number) {
    // console.log(`RowIndex ${ row }`);
    // console.log(`ColIndex ${ col }`);
    // Flip cell state
    this.cellMap()[row][col].state = !this.cellMap()[row][col].state;
  }

  public onTickRateChange() {
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

}
