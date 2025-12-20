import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Map } from './map/map';
import { GameConfig } from './game-config/game-config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Map, GameConfig],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('game-of-life');
}
