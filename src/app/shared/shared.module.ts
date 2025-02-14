import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableButtonComponent } from './components/reusable-button/reusable-button.component';
import { MatButton } from '@angular/material/button';

@NgModule({
  declarations: [ReusableButtonComponent],
  imports: [CommonModule, MatButton],
  exports: [ReusableButtonComponent],
})
export class SharedModule {}
