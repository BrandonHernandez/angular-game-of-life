import { ChangeDetectionStrategy, Component, inject, output, computed } from '@angular/core';
import { GameDataService } from '../services/game-data.service';

@Component({
  selector: 'app-options',
  imports: [],
  templateUrl: './options.html',
  styleUrl: './options.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Options {
  private gameDataService = inject(GameDataService);

  readonly close = output<void>();

  onAddRow() {
    this.gameDataService.addRow();
  }

  onAddColumn() {
    this.gameDataService.addColumn();
  }

  onRemRow() {
    this.gameDataService.remRow();
  }

  onRemColumn() {
    this.gameDataService.remColumn();
  }

  onClose() {
    this.close.emit();
    this.gameDataService.message.set(null);
  }

}
