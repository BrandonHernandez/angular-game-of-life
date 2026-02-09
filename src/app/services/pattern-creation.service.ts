import { Injectable, inject, WritableSignal, Signal, signal, computed } from '@angular/core';
import { ToolFunctionsService } from './tool-functions.service';
import { GameDataService } from './game-data.service';

type ActivePattern = "glider" | "lwSpaceship";
type Cell = 1 | 0;

type Coordinates = {
  r: number;
  c: number;
};
type Pattern = Coordinates[];
type PatternOrientations = Pattern[];

@Injectable({
  providedIn: 'root',
})
export class PatternCreationService {
  private tools = inject(ToolFunctionsService);
  private gameDataService = inject(GameDataService);

  readonly activePattern: WritableSignal<ActivePattern | null> = signal(null);
  readonly lastActivePattern: WritableSignal<ActivePattern | null> = signal(null);

  readonly isPatternCreateInProgress = computed(() => {
    return this.activePattern() !== null;
  });


  public generatePattern(patternOrientations: PatternOrientations, orientationSelector: { value: number }) {

    this.gameDataService.cellMap.update((cellMap) => {
      patternOrientations[orientationSelector.value].forEach((point) => {
        cellMap[point.r][point.c] = 1 as Cell;
      })
      return cellMap;
    });

    if (++orientationSelector.value >= patternOrientations.length) {
      orientationSelector.value = 0;
    }
  }

  private generateGlider_orientationSelector = { value: 0 };
  public generateGlider() {
    const row = this.gameDataService.selectedRow;
    const col = this.gameDataService.selectedCol;
    const rowLen = this.gameDataService.cellMap().length;
    const colLen = this.gameDataService.cellMap()[0].length;

    const orientations: PatternOrientations = [
      [
        {
          r: row,
          c: col,
        },
        {
          r: this.tools.confine(row + 1, rowLen),
          c: col,
        },
        {
          r: this.tools.confine(row + 2, rowLen),
          c: col,
        },
        {
          r: this.tools.confine(row + 2, rowLen),
          c: this.tools.confine(col + 1, colLen),
        },
        {
          r: this.tools.confine(row + 1, rowLen),
          c: this.tools.confine(col + 2, colLen),
        },
      ],
      [
        {
          r: row,
          c: col,
        },
        {
          r: row,
          c: this.tools.confine(col - 1, colLen),
        },
        {
          r: row,
          c: this.tools.confine(col - 2, colLen),
        },
        {
          r: this.tools.confine(row + 1, rowLen),
          c: this.tools.confine(col - 2, colLen),
        },
        {
          r: this.tools.confine(row + 2, rowLen),
          c: this.tools.confine(col - 1, colLen),
        },
      ],
      [
        {
          r: row,
          c: col,
        },
        {
          r: this.tools.confine(row - 1, rowLen),
          c: col,
        },
        {
          r: this.tools.confine(row - 2, rowLen),
          c: col,
        },
        {
          r: this.tools.confine(row - 2, rowLen),
          c: this.tools.confine(col - 1, colLen),
        },
        {
          r: this.tools.confine(row - 1, rowLen),
          c: this.tools.confine(col - 2, colLen),
        },
      ],
      [
        {
          r: row,
          c: col,
        },
        {
          r: row,
          c: this.tools.confine(col + 1, colLen),
        },
        {
          r: row,
          c: this.tools.confine(col + 2, colLen),
        },
        {
          r: this.tools.confine(row - 1, rowLen),
          c: this.tools.confine(col + 2, colLen),
        },
        {
          r: this.tools.confine(row - 2, rowLen),
          c: this.tools.confine(col + 1, colLen),
        },
      ],
    ];

    this.generatePattern(orientations, this.generateGlider_orientationSelector);
  }

  private lwSpaceShipOrientationSelector = { value: 0 };
  public generateLwSpaceShip() {
    const row = this.gameDataService.selectedRow;
    const col = this.gameDataService.selectedCol;
    const rowLen = this.gameDataService.cellMap().length;
    const colLen = this.gameDataService.cellMap()[0].length;

    const orientations: PatternOrientations = [
      [
        {
          r: row,
          c: col,
        },
        {
          r: this.tools.confine(row + 1, rowLen),
          c: col,
        },
        {
          r: this.tools.confine(row + 2, rowLen),
          c: col,
        },
        {
          r: this.tools.confine(row + 3, rowLen),
          c: col,
        },
        {
          r: row,
          c: this.tools.confine(col + 1, colLen),
        },
        {
          r: this.tools.confine(row + 4, rowLen),
          c: this.tools.confine(col + 1, colLen),
        },
        {
          r: row,
          c: this.tools.confine(col + 2, colLen),
        },
        {
          r: this.tools.confine(row + 1, rowLen),
          c: this.tools.confine(col + 3, colLen),
        },
        {
          r: this.tools.confine(row + 4, rowLen),
          c: this.tools.confine(col + 3, colLen),
        },
      ],
      [
        {
          r: row,
          c: col,
        },
        {
          r: row,
          c: this.tools.confine(col - 1, colLen),
        },
        {
          r: row,
          c: this.tools.confine(col - 2, colLen),
        },
        {
          r: row,
          c: this.tools.confine(col - 3, colLen),
        },
        {
          r: this.tools.confine(row + 1, rowLen),
          c: col
        },
        {
          r: this.tools.confine(row + 1, rowLen),
          c: this.tools.confine(col - 4, colLen),
        },
        {
          r: this.tools.confine(row + 2, rowLen),
          c: col
        },
        {
          r: this.tools.confine(row + 3, rowLen),
          c: this.tools.confine(col - 1, colLen),
        },
        {
          r: this.tools.confine(row + 3, rowLen),
          c: this.tools.confine(col - 4, colLen),
        },
      ],
      [
        {
          r: row,
          c: col,
        },
        {
          r: this.tools.confine(row - 1, rowLen),
          c: col,
        },
        {
          r: this.tools.confine(row - 2, rowLen),
          c: col,
        },
        {
          r: this.tools.confine(row - 3, rowLen),
          c: col,
        },
        {
          r: row,
          c: this.tools.confine(col - 1, colLen),
        },
        {
          r: this.tools.confine(row - 4, rowLen),
          c: this.tools.confine(col - 1, colLen),
        },
        {
          r: row,
          c: this.tools.confine(col - 2, colLen),
        },
        {
          r: this.tools.confine(row - 1, rowLen),
          c: this.tools.confine(col - 3, colLen),
        },
        {
          r: this.tools.confine(row - 4, rowLen),
          c: this.tools.confine(col - 3, colLen),
        },
      ],
      [
        {
          r: row,
          c: col,
        },
        {
          r: row,
          c: this.tools.confine(col + 1, colLen),
        },
        {
          r: row,
          c: this.tools.confine(col + 2, colLen),
        },
        {
          r: row,
          c: this.tools.confine(col + 3, colLen),
        },
        {
          r: this.tools.confine(row - 1, rowLen),
          c: col
        },
        {
          r: this.tools.confine(row - 1, rowLen),
          c: this.tools.confine(col + 4, colLen),
        },
        {
          r: this.tools.confine(row - 2, rowLen),
          c: col
        },
        {
          r: this.tools.confine(row - 3, rowLen),
          c: this.tools.confine(col + 1, colLen),
        },
        {
          r: this.tools.confine(row - 3, rowLen),
          c: this.tools.confine(col + 4, colLen),
        },
      ],
    ];

    this.generatePattern(orientations, this.lwSpaceShipOrientationSelector);
  }

  public startPatternCreate(pattern: ActivePattern) {
    this.activePattern.set(pattern);
    this.gameDataService.message.set({ content: `Generating ${pattern}`, origin: 'pattern-creation-service' });
  }

  public cancelPatternCreate() {
    this.lastActivePattern.set(this.activePattern());
    this.activePattern.set(null);
    this.gameDataService.message.set(null);
  }

  public finishPatternCreate() {
    switch (this.activePattern()) {
      case "glider":
        this.generateGlider();
        break;
      case "lwSpaceship":
        this.generateLwSpaceShip();
        break;
      default:
        break;
    }
  }

}
