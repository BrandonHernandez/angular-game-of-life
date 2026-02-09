import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Map } from './map/map';

@Component({
  selector: 'app-root',
  imports: [Map],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('game-of-life');
}
