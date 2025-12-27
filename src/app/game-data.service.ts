import { Injectable, signal, Signal, WritableSignal, computed } from "@angular/core";

type Cell = 1 | 0;

type GeneratePattern = "glider" | "lwSpaceship" | "none";

@Injectable({ providedIn: 'root' })
export class GameDataService {

    private cellMap: WritableSignal<Cell[][]> = signal([]);
    private nextCellMap: WritableSignal<Cell[][]> = signal([]);

    private intervalID = 0;
    private gameRunning = false;

    private tickRate = 100;

    private selectedRow = 0;
    private selectedCol = 0;


    private createPattern: GeneratePattern = "none";
    private creatingPattern: boolean =  false;

    public loadMap() {
        const cellMap = localStorage.getItem("cellMap");
        if (cellMap) {
            this.cellMap = signal(JSON.parse(cellMap));
        }
    }

    public saveMap() {
        localStorage.setItem("cellMap", JSON.stringify(this.cellMap()));
    }

    public clearMap() {
        // console.log(`Rows: ${ this.rows() }`);
        // console.log(`Cols: ${ this.cols() }`);
        this.initMap(this.cellMap().length, this.cellMap()[0].length);
    }

    public play() {
        this.intervalID = setInterval(() => this.developUniverse(), this.tickRate);
        this.gameRunning = true;
    }

    public stop() {
        clearInterval(this.intervalID);
        this.gameRunning = false;
    }

    public stepFwd() {
        this.developUniverse();
    }

    public initMap(rows: number, cols: number) {
        this.cellMap = signal([]);
        for (let i = 0; i < rows; i++) {
            let _row: Cell[] = [];
            for (let j = 0; j < cols; j++) {
                _row.push(0 as Cell);
            }
            this.cellMap().push(_row);
        }
    }

    private initNextMap() {
        this.nextCellMap = signal([]);
        for (let i = 0; i < this.cellMap().length; i++) {
            let _row: Cell[] = [];
            for (let j = 0; j < this.cellMap()[i].length; j++) {
                _row.push(0 as Cell);
            }
            this.nextCellMap().push(_row);
        }
    }

    public developUniverse() {
        this.initNextMap();
        for (let i = 0; i < this.cellMap().length; i++) {
            for (let j = 0; j < this.cellMap()[i].length; j++) {
                this.computeNextGen(i, j, this.countNeighbors(i, j));
            }
        }
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
        if (this.cellMap()[iDynamic][jDynamic]) {
            neighbors++;
        }

        // [i-1,_j_] : N
        iDynamic = (i - 1 < 0) ? iMax : i - 1;
        jDynamic = j;
        if (this.cellMap()[iDynamic][jDynamic]) {
            neighbors++;
        }

        // [i-1,j+1] : NE
        iDynamic = (i - 1 < 0) ? iMax : i - 1;
        jDynamic = (j + 1 > jMax) ? 0 : j + 1;
        if (this.cellMap()[iDynamic][jDynamic]) {
            neighbors++;
        }

        // [_i_,j-1] : W
        iDynamic = i;
        jDynamic = (j - 1 < 0) ? jMax : j - 1;
        if (this.cellMap()[iDynamic][jDynamic]) {
            neighbors++;
        }

        // [_i_,j+1] : E
        iDynamic = i;
        jDynamic = (j + 1 > jMax) ? 0 : j + 1;
        if (this.cellMap()[iDynamic][jDynamic]) {
            neighbors++;
        }

        // [i+1,j-1] : SW
        iDynamic = (i + 1 > iMax) ? 0 : i + 1;
        jDynamic = (j - 1 < 0) ? jMax : j - 1;
        if (this.cellMap()[iDynamic][jDynamic]) {
            neighbors++;
        }

        // [i+1,_j_] : S
        iDynamic = (i + 1 > iMax) ? 0 : i + 1;
        jDynamic = j;
        if (this.cellMap()[iDynamic][jDynamic]) {
            neighbors++;
        }

        // [i+1,j+1] : SE   
        iDynamic = (i + 1 > iMax) ? 0 : i + 1;
        jDynamic = (j + 1 > jMax) ? 0 : j + 1;
        if (this.cellMap()[iDynamic][jDynamic]) {
            neighbors++;
        }

        return neighbors;
    }

    public computeNextGen(i: number, j: number, neighbors: number) {
        if (this.cellMap()[i][j]) {
            // 1. Any live cell with fewer than 2 live neighbors dies, as if by underpopulation.
            if (neighbors < 2) {
                this.nextCellMap()[i][j] = 0 as Cell;
            }
            // 2. Any live cell with 2 or 3 live neighbors lives on to the next generation.
            if (neighbors === 2 || neighbors === 3) {
                this.nextCellMap()[i][j] = 1 as Cell;
            }
            // 3. Any live cell with more than 3 live neighbors dies, as if by overpopulation.
            if (neighbors > 3) {
                this.nextCellMap()[i][j] = 0 as Cell;
            }
        } else {
            // 4. Any dead cell with exactly 3 live neighbors becomes a live cell, as if by reproduction.
            if (neighbors === 3) {
                this.nextCellMap()[i][j] = 1 as Cell;
            }
        }
    }

    public flipCell(row: number, col: number) {
        this.cellMap()[row][col] = this.cellMap()[row][col] ? 0 : 1;
    }

    public onTickRateChange(tickRate: number) {
        this.tickRate = tickRate;
        if (this.gameRunning) {
            this.stop();
            this.play();
        }
    }

    public getMap(): Cell[][] {
        return this.cellMap();
    }

    public getIsGameRunning(): boolean {
        return this.gameRunning;
    }

    public getTickRate(): number {
       return this.tickRate;
    }

    public addRow() {
        this.cellMap().push([]);
        const lastRow = this.cellMap().length - 1;
        const cols = this.cellMap()[0].length;
        for (let j = 0; j < cols; j++) {
            this.cellMap()[lastRow].push(0 as Cell);
        }
    }

    public remRow() {
        this.cellMap().pop();
    }
    
    public addColumn() {
        const rows = this.cellMap().length;
    
        for (let i = 0; i < rows; i++) {
            this.cellMap()[i].push(0 as Cell);
        }
        
    }

    public remColumn() {
        const rows = this.cellMap().length;
    
        for (let i = 0; i < rows; i++) {
            this.cellMap()[i].pop();
        }
    }

    public setCoordinates(row: number, col: number) {
        this.selectedRow = row;
        this.selectedCol = col;
    }

    public generateGlider() {
        const row = this.selectedRow;
        const col =  this.selectedCol;

        this.cellMap()[row][col] = 1 as Cell;
        this.cellMap()[(row + 1) % this.cellMap().length][col] = 1 as Cell;
        this.cellMap()[(row + 2) % this.cellMap().length][col] = 1 as Cell;
        this.cellMap()[(row + 2) % this.cellMap().length][(col + 1) % this.cellMap()[0].length] = 1 as Cell;
        this.cellMap()[(row + 1) % this.cellMap().length][(col + 2) % this.cellMap()[0].length] = 1 as Cell;
    }

    public generateLwSpaceShip() {
        const row = this.selectedRow;
        const col =  this.selectedCol;
        
        this.cellMap()[row][col] = 1 as Cell;
        this.cellMap()[(row + 1) % this.cellMap().length][col] = 1 as Cell;
        this.cellMap()[(row + 2) % this.cellMap().length][col] = 1 as Cell;
        this.cellMap()[(row + 3) % this.cellMap().length][col] = 1 as Cell;

        this.cellMap()[row][(col + 1) % this.cellMap()[0].length] = 1 as Cell;
        this.cellMap()[(row + 4) % this.cellMap().length][(col + 1) % this.cellMap()[0].length] = 1 as Cell;
        
        this.cellMap()[row][(col + 2) % this.cellMap()[0].length] = 1 as Cell;

        this.cellMap()[(row + 1) % this.cellMap().length][(col + 3) % this.cellMap()[0].length] = 1 as Cell;
        this.cellMap()[(row + 4) % this.cellMap().length][(col + 3) % this.cellMap()[0].length] = 1 as Cell;
    }

    public startPatternCreate_Glider() {
        this.createPattern = "glider";
        this.creatingPattern = true;
    }

    public startPatternCreate_LwSpaceship() {
        this.createPattern = "lwSpaceship";
        this.creatingPattern = true;
    }

    public cancelPatternCreate() {
        this.createPattern = "none";
        this.creatingPattern = false;
    }

    public finishPatternCreate() {
        switch (this.createPattern) {
            case "glider":
                this.generateGlider();
                break;
            case "lwSpaceship":
                this.generateLwSpaceShip();
                break;
            default:
                break;
        }
        // Commenting this line allows to create the last selected pattern continuously.
        // this.cancelPatternCreate();
    }

    public isPatternCreateInProgress() {
        return (this.creatingPattern && this.createPattern !== "none");
    }
}