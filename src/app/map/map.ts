import { Component, WritableSignal, signal, OnInit, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameDataService } from '../game-data.service';

type Cell = 1 | 0;

@Component({
  selector: 'app-map',
  imports: [FormsModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {

  private gameDataService = inject(GameDataService);
  public tickRateRaw = signal(400);

  public constructor() {
    this.gameDataService.initMap(45, 45);
  } 

  public getMap(): Cell[][] {
    return this.gameDataService.getMap();
  }

  public play() {
    this.gameDataService.play();
  }

  public stop() {
    this.gameDataService.stop();
  }

  public stepFwd() {
    this.gameDataService.stepFwd();
  }

  public saveMap() {
    this.gameDataService.saveMap();
  }

  public loadMap() {
    this.gameDataService.loadMap();
  }

  public clearMap() {
    this.gameDataService.clearMap();
  }
  
  public onTickRateChange() {
    const tickRate = 500 - this.tickRateRaw();
    this.gameDataService.onTickRateChange(tickRate);
  }
  
  public isGameRunning(): boolean {
    return this.gameDataService.getIsGameRunning();
  }
  
  public tickRate(): number {
    return this.gameDataService.getTickRate();
  }
  
  public onCellClick(row: number, col: number) {
    this.gameDataService.flipCell(row, col);
  }

  public onCellHover(row: number, col: number) {
    this.gameDataService.setCoordinates(row, col);
  }

  public onPointerDown() {
    this.gameDataService.finishPatternCreate();
  }

}
