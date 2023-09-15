import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoModule } from '@web/app/core/components/logo/logo.module';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, LogoModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}