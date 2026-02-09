import {
  Component,
  computed,
  inject,
  ChangeDetectionStrategy,
  Signal,
  WritableSignal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameDataService } from '../services/game-data.service';
import { PatternCreationService } from '../services/pattern-creation.service';
import { Options } from '../options/options';
import { Patterns } from '../patterns/patterns';

type Dialog = 'options' | 'patterns' | null;

@Component({
  selector: 'app-map',
  imports: [FormsModule, Options, Patterns],
  templateUrl: './map.html',
  styleUrl: './map.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Map {
  private gameDataService = inject(GameDataService);
  private patternCreationService = inject(PatternCreationService);

  readonly activeDialog: WritableSignal<Dialog> = signal(null);

  readonly tickRate: Signal<number | string> = computed(() => {
    if (this.gameDataService.tickRate() === this.minTickRate) {
      return 'fastest';
    } else if (this.gameDataService.tickRate() === this.maxTickRate) {
      return 'slowest';
    } else {
      return this.gameDataService.tickRate();
    }
  });

  readonly info: Signal<string | number> = computed(() => {
    const _message = this.gameDataService.message();

    if (_message) {
      return _message.content;
    } else {
      return '';
    }

  });

  readonly minTickRate = this.gameDataService.minTickRate;
  readonly maxTickRate = this.gameDataService.maxTickRate;

  readonly cellMap = computed(() => this.gameDataService.cellMap());

  readonly rows = computed(() => this.gameDataService.cellMap().length);
  readonly cols = computed(() => this.gameDataService.cellMap()[0].length);

  readonly isGameRunning = computed(() => this.gameDataService.isGameRunning());

  ngOnInit() {
    this.gameDataService.initMap(80, 198);
  }

  saveMap() {
    this.gameDataService.saveMap();
  }

  loadMap() {
    this.gameDataService.loadMap();
  }

  clearMap() {
    this.gameDataService.clearMap();
  }

  play() {
    this.gameDataService.play();
  }

  stop() {
    this.gameDataService.stop();
  }

  stepFwd() {
    this.gameDataService.stepFwd();
  }

  doNothing() {
    //
  }

  onTickRateChange(event: Event) {
    this.gameDataService.onTickRateChange(
      parseInt((event.target as HTMLInputElement).value)
    );
  }

  onClick(row: number, col: number) {
    this.gameDataService.setCoordinates(row, col);
    if (this.patternCreationService.isPatternCreateInProgress()) {
      this.patternCreationService.finishPatternCreate();
    } else {
      this.gameDataService.flipCell();
    }
  }

  onRightClick() {
    if (this.patternCreationService.activePattern()) {
      this.patternCreationService.cancelPatternCreate();
    } else {
      let _lastActivePattern = this.patternCreationService.lastActivePattern();
      if (_lastActivePattern) {
        this.patternCreationService.startPatternCreate(_lastActivePattern);
      }
    }
    // Return false to prevent the context menu from displaying
    return false;
  }

  dialog(dialog: Dialog | void) {
    if (this.activeDialog()) {
      this.activeDialog.set(null);
    } else if (dialog) {
      this.activeDialog.set(dialog);
    }
  }

  mouseEnter(text: string) {
    let content = '';
    switch (text) {
      case 'save':
        content = "Save the current map in the browser's local storage";
        break;
        case 'load':
        content = "Load the map saved in the browser's local storage, if any";
        break;
        case 'clear':
        content = "Kills all the cells in the map";
        break;
        case 'play':
        content = "Start the game";
        break;
        case 'stop':
        content = "Stop the game";
        break;
        case 'step':
        content = "One tick";
        break;
        case 'options':
        content = "Configure the map";
        break;
        case 'patterns':
        content = "Select a pattern to create";
        break;
        case 'tick-rate-entry':
        content = "Adjust the tick rate";
        break;
    }
    this.gameDataService.message.set({ content, origin: 'map' })
  }

  mouseLeave() {
    this.gameDataService.message.set(null);
  }

}
