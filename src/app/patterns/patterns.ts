import { Component, ChangeDetectionStrategy, inject, output, computed} from '@angular/core';
import { GameDataService } from '../services/game-data.service';
import { PatternCreationService } from '../services/pattern-creation.service';

type ActivePattern = "glider" | "lwSpaceship";

@Component({
  selector: 'app-patterns',
  imports: [],
  templateUrl: './patterns.html',
  styleUrl: './patterns.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Patterns {
  private gameDataService = inject(GameDataService);
  private patternCreationService = inject(PatternCreationService);

  readonly activePattern = computed(() => this.patternCreationService.activePattern());

  readonly isPatternCreateInProgress = computed(() => this.patternCreationService.isPatternCreateInProgress());

  readonly close = output<void>();

  onClickPattern(pattern: ActivePattern) {
    if (pattern === this.patternCreationService.activePattern()) {
      this.patternCreationService.cancelPatternCreate();
    } else {
      this.patternCreationService.startPatternCreate(pattern);
    }
  }

  onClose() {
    this.close.emit();
  }

}
