import { ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-reusable-button',
  standalone: false,
  templateUrl: './reusable-button.component.html',
  styleUrl: './reusable-button.component.scss',
})
export class ReusableButtonComponent{
  constructor() {}
  @Input() accountType: 'Chequing' | 'Savings' = 'Chequing';

  @Input() disabled: boolean = false;

  @Input() label: string = 'Submit';

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if(!this.disabled) {
    this.clicked.emit();
    }
  }
}
