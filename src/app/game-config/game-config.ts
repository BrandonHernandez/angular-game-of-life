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

}
