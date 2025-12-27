import { Component, inject } from '@angular/core';
import { GameDataService } from '../game-data.service';

@Component({
  selector: 'app-game-config',
  imports: [],
  templateUrl: './game-config.html',
  styleUrl: './game-config.css',
})
export class GameConfig {
  private gameDataService = inject(GameDataService);

  public onAddRow() {
    this.gameDataService.addRow();
  }

  public onAddColumn() {
    this.gameDataService.addColumn();
  }

  public onRemRow() {
    this.gameDataService.remRow();
  }

  public onRemColumn() {
    this.gameDataService.remColumn();
  }

  // public onGliderPointerDown() {
  //   if (!this.getGliderPointerDown()) {
  //     this.gameDataService.setGliderPointerDown();
  //   } else {
  //     this.gameDataService.unsetGliderPointerDownFromConfig();
  //   }
  // }

  public isPatternCreateInProgress() {
    return this.gameDataService.isPatternCreateInProgress();
  }

  public onGliderPointerDown() {
    if (!this.isPatternCreateInProgress()) {
      this.gameDataService.startPatternCreate_Glider();
    } else {
      this.gameDataService.cancelPatternCreate();
    }
  }

  public onLwSpaceshipPointerDown() {
    if (!this.isPatternCreateInProgress()) {
      this.gameDataService.startPatternCreate_LwSpaceship();
    } else {
      this.gameDataService.cancelPatternCreate();
    }
  }

}
